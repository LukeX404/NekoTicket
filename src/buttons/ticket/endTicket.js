const { EmbedBuilder } = require('discord.js');
const transcript = require('discord-html-transcripts');
const config = require('../../config/config.json');

const closingTickets = new Set();

module.exports = {
    config: {
        customId: 'endTicket',
    },
    run: async (client, interaction) => {
        const canalTranscript = interaction.channel;

        try {
            if (closingTickets.has(canalTranscript.id)) {
                interaction.reply({ content: 'Este ticket já está sendo fechado.', ephemeral: true });
                return;
            }

            const userId = canalTranscript.topic;

            const attachment = await transcript.createTranscript(canalTranscript, {
                limit: -1,
                returnType: 'attachment',
                filename: `${canalTranscript.name}.html`,
                saveImages: true,
                footerText: 'Foram exportadas {number} mensagen{s}!',
                poweredBy: true
            });

            const successEmbed = new EmbedBuilder()
                .setDescription('O ticket será fechado em **10 segundos**.')
                .setColor('#2f3136');

            closingTickets.add(canalTranscript.id);

            interaction.deferReply();
            interaction.deleteReply();
            await interaction.channel.send({ embeds: [successEmbed] });

            setTimeout(async () => {
                try {
                    await canalTranscript.delete();
                } catch (err) {
                    console.log(err);
                    return;
                } finally {
                    closingTickets.delete(canalTranscript.id);
                }

                const user = await client.users.fetch(userId);
                try {
                    await user.send({ content: `Transcript do Atendimento: ${canalTranscript.name}:`, files: [attachment] });
                    console.log(`Transcript enviado para ${user.tag}`);
                } catch (dmError) {
                    console.log(`Não foi possível enviar a mensagem para ${user.tag}. Motivo: ${dmError.message}`);
                }

                const transcriptChannel = client.channels.cache.get(config.transcriptChannelId);
                if (transcriptChannel) {
                    transcriptChannel.send({ content: `Transcript do Atendimento: ${canalTranscript.name}:`, files: [attachment] });
                } else {
                    console.log(`Canal de transcrição não encontrado. Verifique se o ID do canal está correto no config.json.`);
                }

            }, 10000);
        } catch (error) {
            console.error(error);
            console.log('Houve um problema ao criar o transcript e enviar para o usuário. Certifique-se de que suas mensagens diretas estão habilitadas');
        }
    },
};