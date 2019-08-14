// requirements
const config = require('./config.json');
const slackBot = require('slackbots');
const Collection = require('collection'); // from discord.js - see package.json
const readdir = require('fs').readdir;

const bot = new slackBot({
  token: config.user_token,
  name: config.bot_name
});
bot.commands = new Collection();
bot.events = new Collection();

const server = require('http').createServer((req, res) => {
  res.end(config.bot_name);
});
server.listen(config.port || 5000); // for future buttons and slash commands

readdir('./events/', (err, files) => {
  if (err) throw err;
  console.log(`Loading ${files.length} events...`);
  files.forEach(file => {
    bot.events.set(
      file.substring(0, file.length - 3),
      require(`./events/${file}`)
    );
    bot.on(file.split('.')[0], (...args) => {
      require(`./events/${file}`).run(bot, ...args);
    });
  });
  console.log(`Events loaded!`);
});
