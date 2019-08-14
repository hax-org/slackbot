export default class Message {
  bot: Object;
  data: Object;
  author: Object;
  channel: Object;
  content: String;
  splitContent: String[];

  constructor(
    bot: Object,
    data: Object,
    author: Object,
    channel: String,
    content: String
  ) {
    this.bot = bot;
    this.data = data;
    this.author = author;
    this.channel = channel;
    this.content = content;
    this.splitContent = content.split(' ');
  }
}
