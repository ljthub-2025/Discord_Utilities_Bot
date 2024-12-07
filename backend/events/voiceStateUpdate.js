const { Events } = require('discord.js');
const { updateVoiceState } = require('../utils/realtime_database');

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
        updateVoiceState(oldState, newState);
    }
}


