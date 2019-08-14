"use strict";
exports.__esModule = true;
var Message = /** @class */ (function () {
    function Message(bot, data, author, channel, content) {
        this.bot = bot;
        this.data = data;
        this.author = author;
        this.channel = channel;
        this.content = content;
        this.splitContent = content.split(' ');
    }
    return Message;
}());
exports["default"] = Message;
