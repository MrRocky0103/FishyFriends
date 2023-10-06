const fishDiseases = require("../data/diseases.json")
const Discord = require("discord.js")

module.exports = {
    name: 'disease',
    description: 'Learn about the most common fish diseases',
    execute(message, args) {
        const page = args[0] || 1;
        const perPage = 5;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const diseaseList = fishDiseases.slice(startIndex, endIndex);
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Most Common Fish Diseases')
            .setDescription('Here are the most common fish diseases:')
            .setThumbnail('https://i.imgur.com/4M34hi2.png')
            .setFooter(`Page ${page} of ${Math.ceil(fishDiseases.length / perPage)}`);
        diseaseList.forEach(disease => {
            embed.addField(disease.name, disease.description);
        });
        message.channel.send(embed).then(sentEmbed => {
            if (page > 1) {
                sentEmbed.react('⬅️');
            }
            if (endIndex < fishDiseases.length) {
                sentEmbed.react('➡️');
            }
            const filter = (reaction, user) => {
                return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            const collector = sentEmbed.createReactionCollector(filter, { time: 60000 });
            collector.on('collect', reaction => {
                if (reaction.emoji.name === '⬅️') {
                    this.execute(message, [page - 1]);
                } else if (reaction.emoji.name === '➡️') {
                    this.execute(message, [page + 1]);
                }
            });
        });
    },
};
