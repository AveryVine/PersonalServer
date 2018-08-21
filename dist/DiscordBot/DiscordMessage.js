"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NoAction_1 = __importDefault(require("./actions/NoAction"));
var DiscordBotCommands_1 = __importDefault(require("./DiscordBotCommands"));
var DiscordMessage = /** @class */ (function () {
    function DiscordMessage(message) {
        this.author = message.author;
        this.rawContent = message.content.trim() + " ";
        this.type = DiscordBotCommands_1.default.NO_COMMAND;
        this.action = new NoAction_1.default();
        if (!this.authorIsBot() && this.rawContent.startsWith('!')) {
            var firstWord = this.rawContent.slice(1, this.rawContent.indexOf(' '));
            var args = this.rawContent.slice(this.rawContent.indexOf(' '), this.rawContent.length);
            this.type = DiscordBotCommands_1.default.parse(firstWord.toLowerCase());
            this.action = this.type.action.apply(args);
        }
    }
    DiscordMessage.prototype.executeAction = function () {
        this.action.execute();
    };
    DiscordMessage.prototype.authorIsBot = function () {
        return this.author.bot;
    };
    return DiscordMessage;
}());
exports.default = DiscordMessage;
