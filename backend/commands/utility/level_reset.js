const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { resetXp } = require('../../utils/xp');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('level_reset')
        .setDescription('Reset user level')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        console.log(`${interaction.user.tag} 嘗試執行等級重置命令`);
        
        const resetConfirmation = await interaction.reply({
            content: '⚠️ 警告：這將會重置伺服器所有用戶的等級！\n確定要重置等級嗎？',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: '確定重置',
                            style: 4,
                            custom_id: 'confirm_reset'
                        },
                        {
                            type: 2, 
                            label: '取消',
                            style: 2,
                            custom_id: 'cancel_reset'
                        }
                    ]
                }
            ],
            fetchReply: true
        });

        const collector = resetConfirmation.createMessageComponentCollector({
            time: 150000
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: '你不能使用這個按鈕！', ephemeral: true });
            }

            try {
                if (i.customId === 'confirm_reset') {
                    await i.deferUpdate();
                    await i.editReply({ content: '⏳ 正在重置等級中...', components: [] });
                    console.log(`${interaction.user.tag} 確認重置伺服器 ${interaction.guild.id} 的等級`);
                    await resetXp(interaction.guild.id);
                    await i.editReply({ content: '✅ 等級已重置！', components: [] });
                } else if (i.customId === 'cancel_reset') {
                    await i.deferUpdate();
                    await i.editReply({ content: '❌ 已取消重置等級', components: [] });
                    console.log(`${interaction.user.tag} 取消重置操作`);
                }
            } catch (error) {
                console.error('處理互動時發生錯誤:', error);
                if (!i.deferred) await i.deferUpdate();
                await i.editReply({ content: '❌ 操作執行時發生錯誤！', components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({
                    content: '操作已超時',
                    components: []
                });
            }
        });
    }
}