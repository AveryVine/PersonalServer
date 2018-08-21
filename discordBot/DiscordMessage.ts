import { Message, User } from 'discord.js'
import Action from './actions/Action';
import PingAction from './actions/PingAction';
import HelpAction from './actions/HelpAction';
import LeagueAction from './actions/LeagueAction';
import YouTubeAction from './actions/YouTubeAction';
import TwitchAction from './actions/TwitchAction';
import InvalidAction from './actions/InvalidAction';
import NoAction from './actions/NoAction';
import { LeagueActionType } from './actions/LeagueAction';

class DiscordMessage {
    private author: User;
    private rawContent: string[];
    private command: Command;
    private args: string[];
    private action: Action;

    constructor(message: Message) {
        this.author = message.author;
        this.rawContent = message.content.trim().split(' ');
        this.command = Command.NO_COMMAND;
        this.args = this.rawContent.splice(0, 1);

        if (!this.authorIsBot() && this.isCommand()) {
            this.command = Command.parse(this.rawContent[0]);
        }

        this.action = this.command.action.apply(this.args);
    }

    public executeAction() {
        this.action.execute();
    }

    public authorIsBot() {
        return this.author.bot;
    }

    private isCommand() {
        return this.rawContent[0] !== undefined && this.rawContent[0].startsWith('!');
    }
}

class Command {
    readonly displayValue: string;
    readonly action: Function;

    private static AllValues: { [name: string]: Command } = {};

    static readonly PING = new Command('!ping', () => {
        return new PingAction();
    });
    static readonly HELP = new Command('!help', () => {
        return new HelpAction();
    });
    static readonly SUMMONER = new Command('!summoner', (args: string) => {
        return new LeagueAction(LeagueActionType.SUMMONER, args);
    });
    static readonly BANS = new Command('!bans', (args: string) => {
        return new LeagueAction(LeagueActionType.BANS, args);
    });
    static readonly YOUTUBE = new Command('!youtube', (args: string) => {
        return new YouTubeAction(args);
    });
    static readonly TWITCH = new Command('!twitch', (args: string) => {
        return new TwitchAction(args);
    });
    static readonly INVALID = new Command('!invalid', () => {
        return new InvalidAction();
    });
    static readonly NO_COMMAND = new Command('!noCommand', () => {
        return new NoAction();
    });

    private constructor(displayValue: string, action: Function) {
        this.displayValue = displayValue;
        this.action = action;

        Command.AllValues[displayValue] = this;
    }

    public static parse(data: string): Command {
        let command = Command.AllValues[data];
        if (!command) {
            command = Command.INVALID;
        }
        return command;
    }
}

export default DiscordMessage;
