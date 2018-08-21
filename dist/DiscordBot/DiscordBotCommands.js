"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PingAction_1 = __importDefault(require("./actions/PingAction"));
var HelpAction_1 = __importDefault(require("./actions/HelpAction"));
var LeagueAction_1 = __importDefault(require("./actions/LeagueAction"));
var YouTubeAction_1 = __importDefault(require("./actions/YouTubeAction"));
var TwitchAction_1 = __importDefault(require("./actions/TwitchAction"));
var InvalidAction_1 = __importDefault(require("./actions/InvalidAction"));
var NoAction_1 = __importDefault(require("./actions/NoAction"));
var LeagueAction_2 = require("./actions/LeagueAction");
var DiscordBotCommand = /** @class */ (function () {
    function DiscordBotCommand(displayValue, action) {
        this.displayValue = displayValue;
        this.action = action;
        DiscordBotCommand.AllValues[displayValue] = this;
    }
    DiscordBotCommand.parse = function (data) {
        var command = DiscordBotCommand.AllValues[data];
        if (!command) {
            command = DiscordBotCommand.INVALID;
        }
        return command;
    };
    DiscordBotCommand.AllValues = {};
    DiscordBotCommand.PING = new DiscordBotCommand('ping', function () {
        return new PingAction_1.default();
    });
    DiscordBotCommand.HELP = new DiscordBotCommand('help', function () {
        return new HelpAction_1.default();
    });
    DiscordBotCommand.SUMMONER = new DiscordBotCommand('summoner', function (args) {
        return new LeagueAction_1.default(LeagueAction_2.LeagueActionType.SUMMONER, args);
    });
    DiscordBotCommand.BANS = new DiscordBotCommand('bans', function (args) {
        return new LeagueAction_1.default(LeagueAction_2.LeagueActionType.BANS, args);
    });
    DiscordBotCommand.YOUTUBE = new DiscordBotCommand('youtube', function (args) {
        return new YouTubeAction_1.default(args);
    });
    DiscordBotCommand.TWITCH = new DiscordBotCommand('twitch', function (args) {
        return new TwitchAction_1.default(args);
    });
    DiscordBotCommand.INVALID = new DiscordBotCommand('invalid', function () {
        return new InvalidAction_1.default();
    });
    DiscordBotCommand.NO_COMMAND = new DiscordBotCommand('noCommand', function () {
        return new NoAction_1.default();
    });
    return DiscordBotCommand;
}());
exports.default = DiscordBotCommand;
