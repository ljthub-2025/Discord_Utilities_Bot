const { SlashCommandBuilder } = require('discord.js');
const { setMessageChannel } = require('../../utils/realtime_database');
module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('setting')
        .setDescription('設定')
        .addSubcommand(subcommand => subcommand
            .setName('message_channel')
            .setDescription('設定訊息頻道')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('選擇頻道')
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'message_channel') {
            const channel = interaction.options.getChannel('channel');
            await setMessageChannel(interaction.guild.id, channel.id, interaction.client);
            await interaction.reply('設定成功！');
        }
    }
}