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
        if (interaction.channel.id !== ticketChannelId) return interaction.reply({ content: `Você não pode utilizar esse comando nesse chat. Utilize ${ticketChannel}` });

        const embed = new discord.EmbedBuilder()
            .setAuthor({ name: 'Atendimento Rede Notz', iconURL: 'https://imgs.search.brave.com/pGlxcYi1fxm74v8oac2s54jXGUv1v684TyK9gyzIlZI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9iay5p/YnhrLmNvbS5ici8y/MDIzLzA4LzE0LzE0/MTc1OTUwMTY3MDMw/LnBuZw' })
            .setFooter({ text: 'Rede Notz', iconURL: 'https://imgs.search.brave.com/pGlxcYi1fxm74v8oac2s54jXGUv1v684TyK9gyzIlZI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9iay5p/YnhrLmNvbS5ici8y/MDIzLzA4LzE0LzE0/MTc1OTUwMTY3MDMw/LnBuZw' })
            .setDescription(`Olá! Nossa equipe está pronta para ajudar com seus problemas e esclarecer suas dúvidas. Estamos disponíveis nos seguintes horários para atendê-lo da melhor forma possível:

**Horário de atendimento: (BRT)**
<a:mineclock:1157805406345764925> Segunda a Sexta: **11h** às **22h**
<a:mineclock:1157805406345764925> Sábado, Domingo e Feriados: **11h** às **18h**

<:nametag:1157809757223141547>**Como criar um ticket?**
selecione nas opções abaixo a categoria que esteja precisando de suporte para que nossa equipe possa ajuda ló.

> Compreenda que nossa equipe não estará presente 24 horas por dia, porém, dentro dos horários de atendimento, garantimos nossa disponibilidade para atende-lo.

<:mcredstone:1157752049262403605> **Abra um ticket somente caso precise de suporte!**`)
            .setColor('#0015ff')
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/-Insert_image_here-.svg/2560px--Insert_image_here-.svg.png')
            .setImage('https://images-ext-2.discordapp.net/external/h35ppAiq9ENULRpeZpCnGvJvTPbithaJnEzjJRD09Dk/https/i1.sndcdn.com/visuals-000479340132-gGD9WT-original.jpg?width=1020&height=213')

        const ticketRow = new discord.ActionRowBuilder()
            .addComponents(
                new discord.SelectMenuBuilder()
                    .setCustomId('ticketMenu')
                    .setPlaceholder('Selecione uma categoria')
                    .addOptions(
                        {
                            label: 'Servidor',
                            description: 'Clique aqui para tirar sua dúvidas referente ao servidor.',
                            value: 'server',
                            emoji: '❓'
                        },
                        {
                            label: 'Compras',
                            description: 'Clique aqui para ajuda com a loja.',
                            value: 'buystore',
                            emoji: '💸'
                        },
                        {
                            label: 'Prêmios',
                            description: 'Clique aqui para resgatar premios.',
                            value: 'giveaway',
                            emoji: '🎁'
                        },
                        {
                            label: 'Denuncias / Revisão',
                            description: 'Clique aqui denuncias ou revisão.',
                            value: 'report',
                            emoji: '🛑'
                        },
                        {
                            label: 'Tag',
                            description: 'Clique aqui para pegar tag.',
                            value: 'tag',
                            emoji: '🎥'
                        },
                        {
                            label: 'Report Bugs',
                            description: 'Clique aqui para pegar reportar um bug.',
                            value: 'bug',
                            emoji: '🎥'
                        },
                    )
            );

        interaction.deferReply();
        interaction.deleteReply();
        return await ticketChannel.send({ embeds: [embed], components: [ticketRow]});
    },
};