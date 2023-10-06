const fish = require("../data/fish.json")
const Discord = require("discord.js")

module.exports = {
    name: 'fish',
    description: 'Learn about the most popular fish to keep',
    execute(message, args) {
        const page = args[0] || 1;
        const perPage = 5;
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const fishList = fish.slice(startIndex, endIndex);
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Most Popular Fish to Keep')
            .setDescription('Here are the most popular fish to keep:')
            .setThumbnail('https://i.imgur.com/4M34hi2.png')
            .setFooter(`Page ${page} of ${Math.ceil(fish.length / perPage)}`);
        fishList.forEach(fish => {
            embed.addField(fish.name, fish.description);
        });
        message.channel.send(embed).then(sentEmbed => {
            if (page > 1) {
                sentEmbed.react('⬅️');
            }
            if (endIndex < fish.length) {
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
