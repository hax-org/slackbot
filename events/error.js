module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }

  async run(bot, err) {
    bot.logger.error(err);
    bot.postMessageToUser(
      'mike.x.cao',
      'An error has occured. Check the console log for more details.'
    );
  }
};
