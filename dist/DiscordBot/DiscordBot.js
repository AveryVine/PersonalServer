"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = __importStar(require("discord.js"));
var DiscordMessage_1 = __importDefault(require("./DiscordMessage"));
var ApiKeys_1 = __importDefault(require("../ApiKeys"));
var DiscordBot = /** @class */ (function () {
    function DiscordBot() {
        this.client = new Discord.Client();
        this.client.on('ready', function () {
            console.log('Discord Bot powered on.');
        });
        this.client.on('message', function (message) {
            new DiscordMessage_1.default(message).executeAction();
        });
        this.client.login(ApiKeys_1.default.getInstance().getKeys().get('discord'));
    }
    return DiscordBot;
}());
exports.default = DiscordBot;
