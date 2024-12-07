const { Events } = require('discord.js');
const { addXpByMessage } = require('../utils/xp');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		try {
			await addXpByMessage(message, message.client);
		} catch (error) {
			console.error('XP 更新錯誤:', error);
			// 可以在這裡添加錯誤處理邏輯
		}
	},
};
