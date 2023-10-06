require('dotenv').config();
const Discord = require('discord.js');
const { fs, readdirSync} = require('fs');
const { join } = require('path');

const client = new Discord.Client({presence: {status: 'dnd', activity: {type: 'WATCHING', name: 'my fishies'}}});
client.commands = new Discord.Collection();

const prefix = process.env.DISCORD_PREFIX;
const token = process.env.DISCORD_TOKEN;

const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
const handlerFiles = readdirSync('./handlers').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

for (const file of handlerFiles) {
  const handler = require(`./handlers/${file}`);
  if (typeof handler === 'function') {
    handler(client);
  } else {
    console.error(`Handler ${file} is not a function`);
  }
}

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command!');
  }
});
client.login(token);