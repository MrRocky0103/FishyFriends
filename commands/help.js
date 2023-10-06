const Discord = require("discord.js");
const { DISCORD_PREFIX } = process.env;

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            commands.forEach(command => {
                data.push(`\`${DISCORD_PREFIX}${command.name}\`: ${command.description}`);
            });
            data.push(`\nYou can send \`${DISCORD_PREFIX}help [command name]\` to get info on a specific command!`);

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('FishBot Commands')
                .setDescription(data)
                .setThumbnail('https://i.imgur.com/4M34hi2.png')
                .setFooter(`Page 1 of ${Math.ceil(commands.size / 10)}`);

            return message.channel.send(embed);
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${DISCORD_PREFIX}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
    },
};
