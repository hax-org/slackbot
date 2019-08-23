let Message = require('../typings/Message').default;

module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }

  async run(bot, data) {
    if (data.type == 'error' && data.error.msg == 'invalid message type: null')
      return;
    if (
      data.subtype == 'bot_message' || // excludes bot messages
      data.type !== 'message' // excludes non-messages
    ) {
      // console.log(data);
      return;
    }

    let channels = (await bot.getChannels()).channels;
    let channel;

    for (var i = 0; i < channels.length; i++) {
      if (data.channel == channels[i].id) {
        channel = channels[i];
      }
    }

    if (!channel) {
      let groups = (await bot.getGroups()).groups;
      for (i = 0; i < groups.length; i++) {
        if (data.channel == groups[i].id) {
          channel = groups[i];
        }
      }

      if (!channel) {
        let dms = (await bot.getImChannels()).ims;
        for (i = 0; i < dms.length; i++) {
          if (data.channel == dms[i].id) {
            channel = dms[i];
          }
        }
      }
    }

    let users = (await bot.getUsers()).members;
    let user;

    for (var j = 0; j < users.length; j++) {
      if (data.user == users[j].id) {
        user = users[j];
      }
    }

    if (!user) return;

    bot.logger.log(
      `${channel ? channel.name : data.channel} | ${
        user ? user.name : 'unknown'
      } -> ${data.text}`
    );

    let msg = new Message(bot, data, user, channel, data.text);
    let prefix = bot.config.prefix;

    if (
      msg.content.match(new RegExp(`^<@!?${bot.id}>$`)) ||
      msg.content.match(new RegExp(`^<@!?${bot.id}> prefix`))
    ) {
      bot.postMessage(
        msg.channel.id,
        `The prefix is \`${bot.config.prefix}\`.`
      );
      return;
    }

    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = bot.commands.get(command);

    bot.logger.log(
      `${msg.author.name} (${msg.author.id}) ran command ${cmd.help.name}`,
      'cmd'
    );

    cmd.run(bot, msg, args).catch(err => {
      bot.postMessage(
        msg.channel.id,
        "You shouldn't ever get this message. Please contact <@UGVB09TQT> with this error:\n```LDIF\n" +
          err.stack +
          '```'
      );
    });
  }
};
