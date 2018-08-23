import Action from './actions/Action2';
import PingAction from './actions/PingAction2';
import HelpAction from './actions/HelpAction2';
import LeagueAction from './actions/LeagueAction2';
import YouTubeAction from './actions/YouTubeAction2';
import TwitchAction from './actions/TwitchAction2';
import InvalidAction from './actions/InvalidAction2';
import NoAction from './actions/NoAction2';
import { LeagueActionType } from './actions/LeagueAction2';
import IncomingMessage from './IncomingMessage2';

export class Command {
    readonly name: string;
    readonly description: string | undefined;
    readonly example: string | undefined;
    readonly action: (message: IncomingMessage) => Action;

    private static commands: { [name: string]: Command } = {};

    static readonly PING = new Command(
        '!ping',
        'Tests your connection to me!',
        '!ping',
        (message: IncomingMessage) => {
            return new PingAction(message);
        }
    );
    static readonly HELP = new Command(
        '!help',
        'Returns the list of accepted commands, with descriptions.',
        '!help',
        (message: IncomingMessage) => {
            return new HelpAction(message);
        }
    );
    static readonly SUMMONER = new Command(
        '!summoner',
        'Provides LoL details for the given summoner.',
        '!summoner Ace Damasos',
        (message: IncomingMessage) => {
            return new LeagueAction(message, LeagueActionType.SUMMONER);
        }
    );
    static readonly BANS = new Command(
        '!bans',
        'Provides the latest optimal ban information for the given ELO.',
        '!bans platinum',
        (message: IncomingMessage) => {
            return new LeagueAction(message, LeagueActionType.BANS);
        }
    );
    static readonly YOUTUBE = new Command(
        '!youtube',
        'Searches YouTube for the given query.',
        '!youtube Thomas the Dank Engine',
        (message: IncomingMessage) => {
            return new YouTubeAction(message);
        }
    );
    static readonly TWITCH = new Command(
        '!twitch',
        'Searches Twitch for the given query.',
        '!twitch imaqtpie',
        (message: IncomingMessage) => {
            return new TwitchAction(message);
        }
    );
    static readonly INVALID = new Command(
        '!invalid',
        undefined,
        undefined,
        (message: IncomingMessage) => {
            return new InvalidAction(message);
        }
    );
    static readonly NO_COMMAND = new Command(
        '!noCommand',
        undefined,
        undefined,
        (message: IncomingMessage) => {
            return new NoAction(message);
        }
    );

    private constructor(name: string, description: string | undefined, example: string | undefined, action: (message: IncomingMessage) => Action) {
        this.name = name;
        this.description = description;
        this.example = example;
        this.action = action;

        Command.commands[name] = this;
    }

    public static getCommands(): { [name: string]: Command } {
        return Command.commands;
    }

    public static parse(data: string): Command {
        let command = Command.commands[data];
        if (!command) {
            command = Command.INVALID;
        }
        return command;
    }
}

export default Command;
