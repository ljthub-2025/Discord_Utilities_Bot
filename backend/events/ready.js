const { Events } = require('discord.js');
const { updateGuild } = require('../utils/realtime_database.js');


module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		for(const guild of client.guilds.cache.values()){
			console.log(`${guild.name} has been connected`);
			await updateGuild(guild);
			
		}

	},
};