// requirements
const config = require('./config.json');
const slackBot = require('slackbots');
const Collection = require('collection'); // from discord.js - see package.json
const klaw = require('klaw');
const path = require('path');

const server = require('http').createServer((req, res) => {
  res.end(config.bot_name);
});
server.listen(config.port || 5000); // for future buttons and slash commands

class HAXBot extends slackBot {
  constructor(options) {
    super(options);

    this.commands = new Collection();
    this.aliases = new Collection();
    this.events = new Collection();
    this.logger = require('./utils/Logger');
    this.config = config;
    this.connected = false;
    this.interval = null;

    this.loadCommand = (commandPath, commandName) => {
      try {
        const props = new (require(`${commandPath}${path.sep}${commandName}`))(
          this
        );
        this.logger.log(`Loading Command: ${props.help.name}. 👌`, 'log');
        props.conf.location = commandPath;
        // props.help.category = this.utils.getType(commandPath);
        if (props.init) {
          props.init(this);
        }
        this.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          this.aliases.set(alias, props.help.name);
        });
        return false;
      } catch (e) {
        return `Unable to load command ${commandName}: ${e}`;
      }
    };
  }
}

const bot = new HAXBot({
  token: config.user_token,
  name: config.bot_name
});

const init = async () => {
  const commandList = [];
  klaw('./modules')
    .on('data', item => {
      const cmdFile = path.parse(item.path);
      if (!cmdFile.ext || cmdFile.ext !== '.js') return;
      const response = bot.loadCommand(
        cmdFile.dir,
        `${cmdFile.name}${cmdFile.ext}`
      );
      commandList.push(cmdFile.name);
      if (response) bot.logger.error(response);
    })
    .on('end', () => {
      bot.logger.log(`Loaded ${commandList.length} commands.`);
    })
    .on('error', error => bot.logger.error(error));

  const eventList = [];
  klaw('./events')
    .on('data', item => {
      const eventFile = path.parse(item.path);
      if (!eventFile.ext || eventFile.ext !== '.js') return;
      const eventName = eventFile.name.split('.')[0];
      try {
        const event = new (require(`${eventFile.dir}${path.sep}${
          eventFile.name
        }${eventFile.ext}`))(bot);
        eventList.push(event);
        bot.events.set(eventName, event);
        bot.on(eventName, (...args) => event.run(bot, ...args));
        delete require.cache[
          require.resolve(
            `${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`
          )
        ];
      } catch (error) {
        bot.logger.error(`Error loading event ${eventFile.name}: ${error}`);
      }
    })
    .on('end', () => {
      bot.logger.log(`Loaded ${eventList.length} events.`);
    })
    .on('error', error => bot.logger.error(error));
};

init();

bot.on('close', () => {
  bot.logger.debug('Disconnected...');
  bot.connected = false;
  bot.interval = setInterval(() => {
    if (bot.connected) {
      bot.logger.debug('Reconnected!');
      clearInterval(bot.interval);
      bot.interval = null;
    } else {
      bot.logger.debug('Reconnecting...');
      bot.login();
    }
  }, 10000);
});
