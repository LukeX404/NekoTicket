const discord = require('discord.js');
const { ticketChannelId } = require('../../config/config.json');

module.exports = {
    name: 'ticket',
    description: 'Criar mensagem de ticket.',
    type: discord.ApplicationCommandType.ChatInput,
    adminOnly: true,
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has('Administrator')) return interaction.reply({ content: 'Você não tem permissões para isso.', ephemeral: true });
        const ticketChannel = client.channels.cache.find(channel => channel.id === ticketChannelId);
        if (interaction.channel.id !== ticketChannelId) return interaction.reply({ content: `Você não pode utilizar esse comando nesse chat. Utilize use ${ticketChannel}` });

        const embed = new discord.EmbedBuilder()
            .setAuthor({ name: 'Atendimento Rede Notz', iconURL: client.user.displayAvatarURL() })
            .setFooter({ text: 'Rede Notz・Atendimento via Ticket ', iconURL: client.user.displayAvatarURL() })
            .setDescription(`- Olá! Nossa equipe está pronta para ajudar com seus problemas e esclarecer suas dúvidas. Estamos disponíveis nos seguintes horários para atendê-lo da melhor forma possível:

**Horário de atendimento: (BRT)**
<a:mineclock:1157805406345764925> Segunda a Sexta: **11h** às **22h**
<a:mineclock:1157805406345764925> Sábado, Domingo e Feriados: **11h** às **18h**

<:nametag:1157809757223141547>**Como criar um ticket?**
- Selecione no meunu uma das opções abaixo a categoria que esteja precisando de suporte para que nossa equipe possa ajuda ló.

> Compreenda que nossa equipe não estará presente 24 horas por dia, porém, dentro dos horários de atendimento, garantimos nossa disponibilidade para atende-lo.

<:mcredstone:1157752049262403605> **Abra um ticket somente caso precise de suporte!**`)
            .setColor('#0015ff')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/-Insert_image_here-.svg/2560px--Insert_image_here-.svg.png')
            .setImage('https://images-ext-2.discordapp.net/external/h35ppAiq9ENULRpeZpCnGvJvTPbithaJnEzjJRD09Dk/https/i1.sndcdn.com/visuals-000479340132-gGD9WT-original.jpg?width=1020&height=213')

        const ticketRow = new discord.ActionRowBuilder()
            .addComponents(
                new discord.StringSelectMenuBuilder()
                    .setCustomId('ticketMenu')
                    .setPlaceholder('Selecione uma categoria')
                    .addOptions(
                        {
                            label: 'Servidor',
                            description: 'Tire suas dúvidas referentes ao servidor',
                            value: 'Server',
                            emoji: 'a:minegif:1157736187172245614'
                        },
                        {
                            label: 'Compras',
                            description: 'Obtenha ajuda com a loja',
                            value: 'Compras',
                            emoji: 'emerald:1157761769889087629'
                        },
                        {
                            label: 'Prêmios',
                            description: 'Resgate prêmios',
                            value: 'Prêmios',
                            emoji: 'holidaycrate:1157808884883398696'
                        },
                        {
                            label: 'Denúncias / Revisão',
                            description: 'Faça uma denúncia ou revisões de Ban',
                            value: 'Denúncias / Revisão',
                            emoji: 'minebarrier:1157737278135861309'
                        },
                        {
                            label: 'Tag',
                            description: 'Solicite sua TAG',
                            value: 'Tag',
                            emoji: 'youtubeemoji:1175858388672970913'
                        },
                        {
                            label: 'Reportar Bugs',
                            description: 'Reporte um BUG',
                            value: 'Reportar Bugs',
                            emoji: '👾'
                        },
                        {
                            label: 'Sugestão',
                            description: 'Dê sugestões para melhorar o servidor',
                            value: 'Sugestão',
                            emoji: 'thinkingsteve:1157739978311336117'
                        },

                        // Mais opções aqui.

                    )                    
            );

            interaction.deferReply();
        interaction.deleteReply();

        const message = await ticketChannel.send({ embeds: [embed], components: [ticketRow] });

        const intervalId = setInterval(() => {
            ticketRow.components[0].setCustomId('ticketMenu')
                .setPlaceholder('Selecione uma categoria')
                .setDisabled(false);
            message.edit({ components: [ticketRow] });
        }, 10000);

        while (true) {
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    },
};