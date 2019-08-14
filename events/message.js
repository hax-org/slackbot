let Message = require('../typings/Message').default;

exports.run = async (bot, data) => {
  if (
    data.subtype == 'bot_message' || // excludes bot messages
    data.type !== 'message' // excludes non-messages
  ) {
    return;
  }

  let channels = (await bot.getChannels()).channels;
  let users = (await bot.getUsers()).members;
  let channel;
  let user;

  for (var i = 0; i < channels.length; i++) {
    if (data.channel == channels[i].id) {
      channel = channels[i];
    }
  }

  for (var j = 0; j < users.length; j++) {
    if (data.user == users[j].id) {
      user = users[j];
    }
  }

  let msg = new Message(bot, data, user, channel, data.text);

  if (data.text.startsWith('<@UHCALC35G>')) {
    bot.postMessage(data.channel, 'Hello World!');
  } else if (data.text.startsWith('!whois')) {
    data.text = data.text.replace('!whois ', '');
    let match = data.text.match(/[A-Z,0-9]+/g);

    if (match[0]) {
      for (var j = 0; j < users.length; j++) {
        if (users[j].name == 'HAXBot') console.log(users[j]);
        if (match[0] == users[j].id) {
          // console.log(users[j]);
          let response = {
            response_type: 'in_channel',
            attachments: [
              {
                author_name: users[j].real_name,
                author_icon: users[j].profile.image_512,
                text: 'User Information for ' + users[j].real_name,
                color: '#' + users[j].color,
                footer: 'HAXBot',
                footer_icon:
                  'https://avatars.slack-edge.com/2019-04-08/590359933058_c6600febd61c3417b6d7_512.jpg',
                ts: Date.now() / 1000,
                fields: [
                  {
                    title: 'Display Name',
                    value: users[j].profile.display_name,
                    short: true
                  },
                  {
                    title: 'Username',
                    value: users[j].name,
                    short: true
                  },
                  {
                    title: 'Title',
                    value: users[j].profile.title,
                    short: true
                  },
                  {
                    title: 'Timezone',
                    value: users[j].tz_label,
                    short: true
                  },
                  {
                    title: 'Email',
                    value: users[j].profile.email,
                    short: true
                  },
                  {
                    title: 'Phone Number',
                    value: users[j].profile.phone,
                    short: true
                  }
                ]
              }
            ]
          };

          if (users[j].profile.status_text.length != 0) {
            response.attachments[0].fields.push({
              title: 'Status',
              value:
                users[j].profile.status_emoji +
                ' ' +
                users[j].profile.status_text,
              short: true
            });
          }

          let special_roles = [];
          if (users[j].is_primary_owner)
            special_roles.push('Workspace Primary Owner');
          if (users[j].is_owner) special_roles.push('Workspace Owner');
          if (users[j].is_admin) {
            special_roles.push('Workspace Admin');
            special_roles.push('HAX Director');
          }
          if (users[j].is_restricted) special_roles.push('Account Restricted');
          if (users[j].is_ultra_restricted)
            special_roles.push('Account Ultra Restricted');
          if (users[j].is_bot) special_roles.push('Bot');
          if (users[j].is_app_users) special_roles.push('App User');

          if (special_roles.length > 0)
            response.attachments[0].fields.push({
              title: 'Special Roles',
              value: special_roles.join(', '),
              short: true
            });

          response.attachments[0].fields.push({
            title: 'User ID',
            value: users[j].id,
            short: true
          });

          bot.postMessage(data.channel, null, response);
        }
      }
    }
  }
};
