import { Message, User, TextChannel, DMChannel, GroupDMChannel } from 'discord.js'
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
    private channel: TextChannel | DMChannel | GroupDMChannel;
    private rawContent: string[];
    private command: Command;
    private args: string[];
    private action: Action;

    constructor(message: Message) {
        this.author = message.author;
        this.channel = message.channel;
        this.rawContent = message.content.trim().split(' ');
        this.command = Command.NO_COMMAND;
        this.args = this.rawContent.slice(0).splice(0, 1);

        if (!this.authorIsBot() && this.isCommand()) {
            this.command = Command.parse(this.rawContent[0]);
        }

        this.action = this.command.action.call(this);
    }

    public executeAction() {
        this.action.execute();
    }

    public getChannel(): TextChannel | DMChannel | GroupDMChannel {
        return this.channel;
    }

    public getCommand(): Command {
        return this.command;
    }

    public getArgs(): string[] {
        return this.args;
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
    readonly action: (message: DiscordMessage) => Action;

    private static AllValues: { [name: string]: Command } = {};

    static readonly PING = new Command('!ping', (message: DiscordMessage) => {
        console.log(message);
        return new PingAction(message);
    });
    static readonly HELP = new Command('!help', (message: DiscordMessage) => {
        return new HelpAction(message);
    });
    static readonly SUMMONER = new Command('!summoner', (message: DiscordMessage) => {
        return new LeagueAction(message, LeagueActionType.SUMMONER);
    });
    static readonly BANS = new Command('!bans', (message: DiscordMessage) => {
        return new LeagueAction(message, LeagueActionType.BANS);
    });
    static readonly YOUTUBE = new Command('!youtube', (message: DiscordMessage) => {
        return new YouTubeAction(message);
    });
    static readonly TWITCH = new Command('!twitch', (message: DiscordMessage) => {
        return new TwitchAction(message);
    });
    static readonly INVALID = new Command('!invalid', (message: DiscordMessage) => {
        return new InvalidAction(message);
    });
    static readonly NO_COMMAND = new Command('!noCommand', (message: DiscordMessage) => {
        return new NoAction(message);
    });

    private constructor(displayValue: string, action: (message: DiscordMessage) => Action) {
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
