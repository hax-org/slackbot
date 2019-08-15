class Command {
  constructor(
    bot,
    {
      name = null,
      description = 'No description provided.',
      category = 'General',
      usage = 'No usage provided.',
      aliases = [],
      permLevel = 0,
      location = ''
    }
  ) {
    this.bot = bot;
    this.conf = {
      aliases,
      permLevel,
      location
    };
    this.help = {
      name,
      description,
      category,
      usage
    };
  }

  async run(message, args, level) {
    throw new Error(
      `Command ${this.constructor.name} doesn't provide a run method.`
    );
  }
}
module.exports = Command;
