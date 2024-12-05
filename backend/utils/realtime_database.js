const { ref, get, onValue, set } = require("firebase/database");
const { db } = require('./firebase.js');
const { db_root } = require('../config.json');

const setGuild = async (guild) => {
    const guildRef = ref(db,  db_root + '/guilds/' + guild.id);
    set(guildRef, {
        name: guild.name,
    });
};

module.exports = { setGuild };
