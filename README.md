# HAXBot: The Informational Slack Bot

## TODO

- Add ability to run standups - DMs specified users, and runs them through a typical Scrum standup, putting results into a thread.
- Add birthday reminders - we as an organization love celebrating each other's birthdays :)
- Add commands that return critical organization info - like links to our Notion, member application, and more.
- Add some fun commands - memes, image gen, and more.
- Add more typings, modularization, and better event and command handling!

## Configuration

Create a file in the root directory named `config.json`, populated with the Slack token, app name, and port as follows:

```{
  "user_token": "user_token_here",
  "bot_name": "name of your Slack app",
  "port": "port for the express middleware to run on"
}
```
