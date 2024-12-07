const { ref, get, onValue, set, update } = require("firebase/database");
const { db } = require('./firebase.js');
const { db_root } = require('../config.json');
const { VoiceState } = require("discord.js");
const { addXpByVoiceDuration } = require('./xp.js');


const getChannels = async (guild) => {
    const results = {}
    guild.channels.cache.forEach(element => {
        results[element.id] = {
            name: element.name,
            type: element.type
        }
    });
    return results;
    
};

const getUsers = async (guild) => {
    const results = {}
    guild.members.cache.forEach(element => {
        results[element.id] = {

            avatar: element.avatar,
            display_name: element.displayName,
            nickname: element.nickname
        }
    });
    return results;
};

const updateGuild = async (guild) => {
    const guildRef = ref(db, db_root + '/guilds/' + guild.id);
    const channels = await getChannels(guild);
    const users = await getUsers(guild);
    
    const snapshot = await get(guildRef);
    const existingData = snapshot.val() || {};
    
    const updates = {
        name: guild.name,
        channels: {},
        users: {}
    };
    
    Object.entries(channels).forEach(([channelId, channelData]) => {
        updates.channels[channelId] = channelData;
    });
    
    Object.entries(users).forEach(([userId, userData]) => {
        const existingUser = existingData.users?.[userId] || {};
        updates.users[userId] = {
            ...userData,
            voice_state: existingUser.voice_state || null,
            voice_start_time: existingUser.voice_start_time || null,
            voice_duration: existingUser.voice_duration || 0,
            current_channel: existingUser.current_channel || null,
            xp: existingUser.xp || 0,
            level: existingUser.level || 0
        };
    });

    const settings = existingData.settings || {};
    updates.settings = settings;
    
    await update(guildRef, updates);
};

const getTotalTime = async (userRef) => {
    const snapshot = await get(userRef);
    const userData = snapshot.val();
    let time = userData?.voice_duration || 0;
    
    if (!userData || !userData.voice_start_time) {
        return 0;
    }

    time += Date.now() - userData.voice_start_time;

    await update(userRef, {
        voice_duration: time
    });
    
    return time;
}
    
const updateVoiceState = async (oldState, newState) => {
    const getVoiceStateUpdate = (state, channelId) => ({
        voice_state: state,
        voice_start_time: state === 'leave' ? null : Date.now(),
        voice_end_time: state === 'leave' ? Date.now() : null,
        current_channel: channelId
    });

    const oldChannelId = oldState.channel?.id || null;
    const newChannelId = newState.channel?.id || null;
    
    const getUserRef = (state) => ref(db, `${db_root}/guilds/${state.guild.id}/users/${state.member.id}`);
    const oldUserRef = getUserRef(oldState);
    const newUserRef = getUserRef(newState);

    if (!oldChannelId && newChannelId) {
        console.log(`${newState.member.displayName} 進入新頻道 ${newChannelId}`);
        await update(newUserRef, getVoiceStateUpdate('enter', newChannelId));
    } else if (oldChannelId && !newChannelId) {
        const totalTime = await getTotalTime(oldUserRef);
        console.log(`${oldState.member.displayName} 離開頻道 ${oldChannelId} 總時間 ${totalTime}`);
        await update(oldUserRef, getVoiceStateUpdate('leave', null));
        await addXpByVoiceDuration(oldUserRef, totalTime, oldState.client);
    } else if (oldChannelId && newChannelId) {
        const isServerChange = oldState.guild.id !== newState.guild.id;
        const isChannelChange = oldChannelId !== newChannelId;
        
        if (isServerChange) {
            console.log(`${oldState.member.displayName} 跨伺服器轉移到 ${newChannelId} 總時間 ${totalTime}`);
            await update(oldUserRef, getVoiceStateUpdate('leave', null));
            await update(newUserRef, getVoiceStateUpdate('enter', newChannelId));
            await addXpByVoiceDuration(oldUserRef, totalTime, oldState.client);
            
        } else if (isChannelChange) {
            console.log(`${oldState.member.displayName} 同伺服器內轉移到 ${newChannelId} 總時間 ${totalTime}`);
            await update(oldUserRef, getVoiceStateUpdate('leave', null));
            await update(newUserRef, getVoiceStateUpdate('transfer', newChannelId));
            await addXpByVoiceDuration(oldUserRef, totalTime, oldState.client);
        }
        
    }
};

const setMessageChannel = async (guildId, channelId, client) => {
    const guildRef = ref(db, db_root + '/guilds/' + guildId + '/settings');
    await update(guildRef, { message_channel_id: channelId });

    // 取得頻道物件
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
        console.error('找不到指定的頻道');
        return;
    }

    // 發送訊息到頻道
    try {
        await channel.send('此頻道已被設定為訊息頻道');
    } catch (error) {
        console.error('發送訊息時發生錯誤:', error);
    }
};

module.exports = { updateGuild, updateVoiceState, setMessageChannel };