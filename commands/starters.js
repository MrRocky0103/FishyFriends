const starters = require('../data/starters.json');
const Discord = require('discord.js');

module.exports = {
  name: 'starterfish',
  description: 'Displays all the starter fishes to keep in the aquarist hobby',
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    starters.forEach(starter => {
      data.push(`**${starter.name}**: ${starter.description}\n`);
    });

    const embeds = [];
    const pages = Math.ceil(starters.length / 5);
    for (let i = 0; i < pages; i++) {
      const start = i * 5;
      const end = start + 5;
      const pageData = data.slice(start, end);
      const pageEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Starter Fishes')
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

      collector.on('collect', reaction => {
        reaction.emoji.name === '⬅️' ? currentPage-- : currentPage++;
        currentPage = (currentPage + pages) % pages;
        msg.edit(embeds[currentPage]);
      });

      collector.on('end', () => {
        msg.reactions.removeAll();
      });
    });
  },
};