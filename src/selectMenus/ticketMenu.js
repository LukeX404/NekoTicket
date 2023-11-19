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

        let ticketOption = '';
        let categoryId = '';

        if (interaction.values[0] === 'server') {
            categoryId = '1175476758213054485';
            ticketOption = 'Servidor.';
        } else if (interaction.values[0] === 'buystore') {
            categoryId = '1175476834406768701';
            ticketOption = 'Compras.';
        } else if (interaction.values[0] === 'giveaway') {
            categoryId = '1175476890157449348';
            ticketOption = 'Prêmios.';
        } else if (interaction.values[0] === 'report') {
            categoryId = '1175477178423590972';
            ticketOption = 'Denúncias / Revisão.';
        } else if (interaction.values[0] === 'tag') {
            categoryId = '1175477212573618309';
            ticketOption = 'Tag';
        } else if (interaction.values[0] === 'bug') {
            categoryId = '1154594889871401026';
            ticketOption = 'Bug';
        }

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
            .setAuthor({ name: 'RedeNotz Ticket' })
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