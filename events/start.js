module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }

  async run(bot) {
    // bot.postMessage('GHC7C7W3V', 'Hello, world! HAXBot is now alive!');
    bot.id = await bot.getUserId(bot.name.toLowerCase());

    bot.logger.ready(`${bot.name} (${bot.id}) is now alive!`);
    bot.connected = true;
  }
};
