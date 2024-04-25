const discord = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    config: {
        customId: 'ticketMenu',
    },
    run: async (client, interaction) => {
        const guild = client.guilds.cache.get(interaction.guild.id);
        const guildChannels = guild.channels.cache;
        const ticketChannelName = `ticket-${interaction.user.username.toLowerCase()}`;

        const errorEmbed = new discord.EmbedBuilder()
            .setDescription('Você já possui um ticket aberto! Encerre o atual para abrir um novo.')
            .setColor('2F3136')

        for (const channel of guildChannels.values()) {
            if (channel.name.startsWith('ticket')) {
                let ticketOwnerId = channel.topic;
                if (ticketOwnerId === interaction.user.id) {
                    return interaction.reply({ ephemeral: true, embeds: [errorEmbed], });
                }
            }
        }

        const categoryMap = {
            'Server': '1175476758213054485',
            'Compras': '1175476834406768701',
            'Prêmios': '1175476890157449348',
            'Denúncias / Revisão': '1175477178423590972',
            'Tag': '1175477212573618309',
            'Reportar Bugs': '1154594889871401026',
            'Sugestão': '1175856564050075760'
        };

        const selectedValue = interaction.values[0];

        if (!categoryMap[selectedValue]) {
            return interaction.reply({ ephemeral: true, content: 'Opção inválida.' });
        }

        const categoryId = categoryMap[selectedValue];
        const ticketOption = selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1);

        const staffRoleId = config.staffRoleId;
        const ticketChannel = await guild.channels.create({
            name: `${ticketChannelName}`,
            type: discord.ChannelType.GuildText,
            parent: categoryId,
            topic: `${interaction.user.id}`,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [
                        discord.PermissionFlagsBits.SendMessages,
                        discord.PermissionFlagsBits.ViewChannel,
                        discord.PermissionFlagsBits.EmbedLinks,
                        discord.PermissionFlagsBits.AttachFiles,
                    ],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [
                        discord.PermissionFlagsBits.ViewChannel
                    ],
                },
                {
                    id: staffRoleId,
                    allow: [
                        discord.PermissionFlagsBits.SendMessages,
                        discord.PermissionFlagsBits.ViewChannel
                    ],
                },
            ],
        });

        const ticketMenuEmbed = new discord.EmbedBuilder()
            .setAuthor({ name: 'Atendimento Rede Notz', iconURL: client.user.displayAvatarURL() })
            .setFooter({ text: 'Rede Notz・Atendimento via Ticket ', iconURL: client.user.displayAvatarURL() })
            .setDescription(`Olá! <@${interaction.user.id}> Seja bem-vindo(a) ao seu \`TICKET\`. \n Por favor, descreva detalhadamente o motivo da sua solicitação e em breve entraremos em contato para ajudá-lo(a) da melhor forma possível.`)
            .setColor('#63f542')
            .addFields(
                [
                    {
                        name: '**MOTIVO**',
                        value: `\`${ticketOption}\``,
                        inline: true,
                    }
                ]
            )
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }))

        const ticketButtonsPainel = new discord.ActionRowBuilder()
            .addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('endTicket')
                    .setLabel('Fechar Ticket')
                    .setEmoji('a:cancel:1157744202449420308')
                    .setStyle('Danger')
            )
            .addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('claimTicket')
                    .setLabel('Claim')
                    .setEmoji('🔐')
                    .setStyle('Primary')
            )

        await ticketChannel.send({ embeds: [ticketMenuEmbed], content: `||<@${interaction.user.id}>||`, components: [ticketButtonsPainel] });

        const sucessEmbed = new discord.EmbedBuilder()
            .setDescription('Seu ticket foi criado com sucesso.')
            .setColor('#74eb34')

        const goToTicketChannelButton = new discord.ActionRowBuilder()
            .addComponents(
                new discord.ButtonBuilder()
                    .setLabel('Ir para Ticket')
                    .setURL(ticketChannel.url)
                    .setStyle('Link')
            )

        await interaction.reply({ embeds: [sucessEmbed], components: [goToTicketChannelButton], ephemeral: true });

    },
}