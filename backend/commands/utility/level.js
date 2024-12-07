const { SlashCommandBuilder } = require('discord.js');
const { getUserLevel, nextLevelXP, getUserXP } = require('../../utils/xp');
module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Check user level')
        .addUserOption(option => option.setName('user').setDescription('The user to check').setRequired(false)),
    async execute(interaction) {    
        const user = interaction.options.getUser('user') || interaction.user;
        const guildId = interaction.guild.id;
        const userId = user.id;
        const level = await getUserLevel(guildId, userId);
        const requiredXP = nextLevelXP(level);
        const xp = await getUserXP(guildId, userId);
        
        // 創建進度條
        const progress = Math.min(Math.floor((xp / requiredXP) * 10), 10);
        const progressBar = '▰'.repeat(progress) + '▱'.repeat(10 - progress);
        
        const embed = {
            color: 0x0099ff,
            title: `${user.username} 的等級資訊`,
            thumbnail: {
                url: user.displayAvatarURL({ dynamic: true })
            },
            fields: [
                {
                    name: '當前等級',
                    value: `Level ${level}`,
                    inline: true
                },
                {
                    name: '經驗值',
                    value: `${xp}/${requiredXP}`,
                    inline: true
                },
                {
                    name: '進度',
                    value: progressBar
                }
            ],
            timestamp: new Date()
        };
        
        // console.log(`${user.username} 的等級是 ${level}，下一級需要 ${requiredXP} 經驗值，目前經驗值為 ${xp}`);
        await interaction.reply({ embeds: [embed] });
    }
}