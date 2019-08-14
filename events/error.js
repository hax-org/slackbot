exports.run = (bot, err) => {
  console.log(err);
  bot.postMessageToUser(
    'mike.x.cao',
    'An error has occured. Check the console log for more details.'
  );
};
