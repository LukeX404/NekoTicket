const { EmbedBuilder } = require('discord.js');
const config = require('../../config/config.json');

// Adicione uma coleção para armazenar IDs de canais claimados
const claimedChannels = new Set();

module.exports = {
    config: {
        customId: 'claimTicket',
    },
    run: async (client, interaction) => {
        const superiorRoleId = config.superiorRoleId;
        try {
            if (!interaction.member.roles.cache.has(superiorRoleId)) {
                console.log('Usuário não tem permissões necessárias');
                return interaction.reply({ content: 'Você não tem permissões para isso.', ephemeral: true });
            }

            if (claimedChannels.has(interaction.channel.id)) {
                console.log('Ticket já foi claimado');
                return interaction.reply({ content: 'Este ticket já foi claimado.', ephemeral: true });
            }

            const claimedEmbed = new EmbedBuilder()
                .setAuthor({ name: `Ticket foi claimado por ${interaction.member.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
                .setColor('#ff0000');

            const roleToRemovePermissions = interaction.guild.roles.cache.get(config.roleToRemoveId);
            const channel = interaction.channel;

            await interaction.channel.send({ embeds: [claimedEmbed] });
            await channel.permissionOverwrites.edit(roleToRemovePermissions, {
                ViewChannel: null,
                SendMessages: null,
            });

            // Marca o canal como claimado
            claimedChannels.add(interaction.channel.id);

            interaction.deferReply();
            interaction.deleteReply();
        } catch (error) {
            console.error("Erro ao processar a interação no claimTicket.js:", error);
            return interaction.reply({ content: 'Ocorreu um erro ao processar a interação.', ephemeral: true });
        }
    },
};