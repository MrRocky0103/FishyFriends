const fish = require('../data/brands.json');
const Discord = require('discord.js');

module.exports = {
  name: 'brands',
  description: 'Displays all the perfect brands to use',
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    fish.forEach(fish => {
      data.push(`**${fish.name}**: ${fish.description}\n`);
    });

    const embeds = [];
    const pages = Math.ceil(fish.length / 5);
    for (let i = 0; i < pages; i++) {
      const start = i * 5;
      const end = start + 5;
      const pageData = data.slice(start, end);
      const pageEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Fish brands')
        .setDescription(pageData)
        .setThumbnail('https://i.imgur.com/4M34hi2.png')
        .setFooter(`Page ${i + 1} of ${pages}`);
      embeds.push(pageEmbed);
    }

    let currentPage = 0;
    message.channel.send(embeds[currentPage]).then(msg => {
      msg.react('⬅️').then(() => msg.react('➡️'));

      const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
      };

      const collector = msg.createReactionCollector(filter, { time: 60000 });

      collector.on('collect', (reaction, user) => {
        if (reaction.emoji.name === '⬅️') {
          if (currentPage === 0) {
            currentPage = embeds.length - 1;
          } else {
            currentPage--;
          }
          msg.edit(embeds[currentPage]);
        } else if (reaction.emoji.name === '➡️') {
          if (currentPage === embeds.length - 1) {
            currentPage = 0;
          } else {
            currentPage++;
          }
          msg.edit(embeds[currentPage]);
        }
      });

      collector.on('end', () => {
        msg.reactions.removeAll();
      });
    });
  },
};
