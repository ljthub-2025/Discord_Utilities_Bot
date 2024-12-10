const { SlashCommandBuilder } = require('discord.js');
const { db_root,project_id } = require('../../config.json');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('Dashboard'),
    async execute(interaction) {
        const url = `https://${project_id}.web.app/guild-ranking/${db_root}/${interaction.guild.id}`;
        await interaction.reply({
            embeds: [{
                title: 'Server Dashboard',
                description: 'Click the button below to access your server dashboard',
                color: 0x0099FF
            }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 5,
                    label: 'Open Dashboard',
                    url: url
                }]
            }]
        });
    }
}