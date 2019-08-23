const Command = require(`${process.cwd()}/typings/Command.js`);

class startstandup extends Command {
  constructor(bot) {
    super(bot, {
      name: 'startstandup',
      description: '',
      usage: 'startstandup',
      aliases: [],
      permLevel: 1
    });
  }

  async run(bot, msg, args) {
    bot.postMessage(
      msg.channel.id,
      `<!channel> It's Scrum Standup time! :tada: :tada:

*Please answer these three questions in this thread:*
1. What did you accomplish since the last meeting/standup?
2. What are you working on until the next meeting?
3. What is getting in your way or keeping you from doing your job?

Please keep the answers to *2-3* sentences and include team goings-on in your responses!`
    );
  }
}

module.exports = startstandup;
