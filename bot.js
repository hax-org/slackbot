// requirements
const slackBot = require('slackbots');
const Message = require('./typings/Message').default;
const Collection = require('collection');
const readdir = require('fs').readdir;

const bot = new slackBot({
  token: require('./config.json').user_token,
  name: 'HAXBot'
});
bot.commands = new Collection();
bot.events = new Collection();

const server = require('http').createServer((req, res) => {
  res.end('HAXBot');
});
server.listen(process.env.PORT || 5000);

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
