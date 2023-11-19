const discord = require('discord.js');

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
                    return interaction.reply({ ephemeral: true, embeds: [errorEmbed] });
                }
            }
        }

        const categoryMap = {
            'server': '1175476758213054485',
            'buystore': '1175476834406768701',
            'giveaway': '1175476890157449348',
            'report': '1175477178423590972',
            'tag': '1175477212573618309',
            'bug': '1154594889871401026',
            'sugestao': '1175856564050075760'
        };

        const selectedValue = interaction.values[0];

        if (!categoryMap[selectedValue]) {
            return interaction.reply({ ephemeral: true, content: 'Opção inválida.' });
        }

        const categoryId = categoryMap[selectedValue];
        const ticketOption = selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1);

        const ticketChannel = await guild.channels.create({
            name: `${ticketChannelName}`,
            type: discord.ChannelType.GuildText,
            parent: categoryId,
            topic: `${interaction.user.id}`,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [discord.PermissionFlagsBits.ViewChannel],
                },
            ],
        });

        const ticketMenuEmbed = new discord.EmbedBuilder()
            .setAuthor({ name: 'Atendimento Rede Notz', iconURL: 'https://imgs.search.brave.com/pGlxcYi1fxm74v8oac2s54jXGUv1v684TyK9gyzIlZI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9iay5p/YnhrLmNvbS5ici8y/MDIzLzA4LzE0LzE0/MTc1OTUwMTY3MDMw/LnBuZw' })
            .setFooter({ text: 'Rede Notz・Atendimento via Ticket ', iconURL: 'https://imgs.search.brave.com/pGlxcYi1fxm74v8oac2s54jXGUv1v684TyK9gyzIlZI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9iay5p/YnhrLmNvbS5ici8y/MDIzLzA4LzE0LzE0/MTc1OTUwMTY3MDMw/LnBuZw' })
            .setDescription('Seja bem vindo(a) ao seu **TICKET**, entraremos em contato em breve.')
            .setColor('#63f542')
            .addFields([
                {
                    name: '**MOTIVO**',
                    value: `\`${ticketOption}\``,
                    inline: true,
                }
            ])
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }))

        const ticketButtonsPainel = new discord.ActionRowBuilder()
            .addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('endTicket')
                    .setLabel('Fechar Ticket')
                    .setStyle('Danger')
            )

        await ticketChannel.send({ embeds: [ticketMenuEmbed], content: `||<@${interaction.user.id}>||`, components: [ticketButtonsPainel] });

        const sucessEmbed = new discord.EmbedBuilder()
            .setDescription('Seu ticket foi criado com sucesso.')
            .setColor('#2f3136')

        const goToTicketChannelButton = new discord.ActionRowBuilder()
            .addComponents(
                new discord.ButtonBuilder()
                    .setLabel('Ir para Ticket')
                    .setURL(ticketChannel.url)
                    .setStyle('Link')
            )

        await interaction.reply({embeds: [sucessEmbed], components: [goToTicketChannelButton], ephemeral: true});

    },
}