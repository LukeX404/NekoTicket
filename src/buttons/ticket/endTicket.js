const { EmbedBuilder } = require('discord.js');
const transcript = require('discord-html-transcripts');

module.exports = {
    config: {
        customId: 'endTicket',
    },
    run: async (client, interaction) => {
        const canalTranscript = interaction.channel;

        try {
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

            interaction.deferReply();
            interaction.deleteReply();
            await interaction.channel.send({ embeds: [successEmbed] });

            setTimeout(async () => {
                try {
                    await canalTranscript.delete();
                } catch (err) {
                    console.log(err);
                    return;
                }

                const user = await client.users.fetch(userId);
                try {
                    await user.send({ content: `Transcript do Atendimento: ${canalTranscript.name}:`, files: [attachment] });
                    console.log(`Transcript enviado para ${user.tag}`);
                } catch (dmError) {
                    console.log(`Não foi possível enviar a mensagem para ${user.tag}. Razão: ${dmError.message}`);
                }

            }, 10000);
        } catch (error) {
            console.error(error);
            console.log('Houve um problema ao criar o transcript e enviar para o usuário. Certifique-se de que suas mensagens diretas estão habilitadas');
        }
    },
};