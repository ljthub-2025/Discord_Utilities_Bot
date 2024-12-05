const { ref, get, onValue, set } = require("firebase/database");
const { db } = require('./firebase.js');

const setGuild = async (guild) => {
    const guildRef = ref(db, 'guilds/' + guild.id);
    set(guildRef, {
        name: guild.name,
    });
};

module.exports = { setGuild };
