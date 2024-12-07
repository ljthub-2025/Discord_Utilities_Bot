const { ref, get, update } = require("firebase/database");
const { db } = require('./firebase.js');
const { db_root } = require('../config.json');

const nextLevelXP = (level) => {
    return Math.floor(100 * Math.pow(level, 1.5));
}

const createLevelUpEmbed = (userId, currentLevel, newLevel, remainingXP) => {
    //計算進度條
    const requiredXP = nextLevelXP(newLevel);
    const progress = Math.min(Math.floor((remainingXP / requiredXP) * 10), 10);
    const progressBar = '▰'.repeat(progress) + '▱'.repeat(10 - progress);

    return {
        color: 0x0099ff,
        title: `🎉 等級提升！`,
        fields: [
            {
                name: '用戶',
                value: `<@${userId}>`,
                inline: true
            },
            {
                name: '等級變化',
                value: `${currentLevel} ➜ ${newLevel}`,
                inline: true
            },
            {
                name: '下一級',
                value: `${remainingXP}/${requiredXP}`,
                inline: true
            },
            {
                name: '進度',
                value: progressBar
            }
        ],
        timestamp: new Date()
    }
}

const UpdateXP = async (userRef, client) => {
  try {
    // 獲取當前用戶數據
    const userData = (await get(userRef)).val();
    
    const currentXP = userData.xp || 0;
    const currentLevel = userData.level || 1;
    
    // 檢查是否可以升級（使用while循環來處理多次升級）
    let newLevel = currentLevel;
    let remainingXP = currentXP;
    let leveledUp = false;
    
    while (remainingXP >= nextLevelXP(newLevel)) {
      newLevel += 1;
      remainingXP -= nextLevelXP(newLevel - 1);
      leveledUp = true;
    }

    if (leveledUp) {
      
      // 取公會ID和用戶ID從userRef路徑
      const pathSegments = userRef.toString().split('/');
      const guildId = pathSegments[pathSegments.indexOf('guilds') + 1];
      const userId = pathSegments[pathSegments.indexOf('users') + 1];
      
      // 獲取通知頻道設定
      const settingsRef = ref(db, `${db_root}/guilds/${guildId}/settings`);
      const settings = (await get(settingsRef)).val();
      const levelUpChannelId = settings?.message_channel_id;

      console.log(levelUpChannelId);

      const embed = createLevelUpEmbed(userId, currentLevel, newLevel, remainingXP);

      if (levelUpChannelId) {
        try {
          if (!client || !client.channels) {
            console.error('Discord client 未定義或無效');
            return;
          }
          
          const channel = await client.channels.fetch(levelUpChannelId);
          if (channel?.isTextBased()) {
            await channel.send({ embeds: [embed] });
          }
        } catch (error) {
          console.error('發送升級訊息時發生錯誤:', error);
        }
      }
    }
    
    // 更新用戶數據
    await update(userRef, {
      xp: remainingXP,
      level: newLevel,
      lastUpdated: new Date()
    });
    
    // 返回升級相關信息
    return {
      leveledUp,
      oldLevel: currentLevel,
      newLevel,
      currentXP: remainingXP,
      nextLevelXP: nextLevelXP(newLevel)
    };
  } catch (error) {
    console.error('更新經驗值時發生錯誤:', error);
    throw error;
  }
};

const addXpByVoiceDuration = async (userRef, duration, client) => {
    try {
        const userData = (await get(userRef)).val();
        const currentXP = userData?.xp || 0;
        
        const addXP = Math.floor(duration / 1000);
        
        await update(userRef, {
            xp: currentXP + addXP,
        });
        
        return await UpdateXP(userRef, client);
    } catch (error) {
        console.error('添加語音經驗值時發生錯誤:', error);
        throw error;
    }
}

const addXpByMessage = async (message, client) => {
    const userRef = ref(db, `${db_root}/guilds/${message.guild.id}/users/${message.author.id}`);
    const userData = (await get(userRef)).val();
    const currentXP = userData.xp || 0;
    const addXP = Math.floor(message.content.length / 10);
    await update(userRef, {
        xp: currentXP + addXP,
    });

    return await UpdateXP(userRef, client);
}

const resetXp = async (guildId) => {
    const guildRef = ref(db, `${db_root}/guilds/${guildId}`);
    const guildData = (await get(guildRef)).val();
    // 使用 Object.keys() 來遍歷用戶
    const users = guildData.users || {};
    for (const userId of Object.keys(users)) {
        const userRef = ref(db, `${db_root}/guilds/${guildId}/users/${userId}`);
        await update(userRef, {
            xp: 0,
            level: 1
        });
    }
}

const getUserLevel = async (guildId, userId) => {
    const guildRef = ref(db, `${db_root}/guilds/${guildId}`);
    const guildData = (await get(guildRef)).val();
    const userData = guildData.users[userId] || {};
    return userData.level || 1;
}

const getUserXP = async (guildId, userId) => {
    const guildRef = ref(db, `${db_root}/guilds/${guildId}`);
    const guildData = (await get(guildRef)).val();
    const userData = guildData.users[userId] || {};
    return userData.xp || 0;
}

module.exports = {
  UpdateXP,
  addXpByVoiceDuration,
  resetXp,
  getUserLevel,
  getUserXP,
  nextLevelXP,
  addXpByMessage
}
