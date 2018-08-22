import DiscordMessage from './DiscordMessage';
import Action from './actions/Action';
import PingAction from './actions/PingAction';
import HelpAction from './actions/HelpAction';
import LeagueAction from './actions/LeagueAction';
import YouTubeAction from './actions/YouTubeAction';
import TwitchAction from './actions/TwitchAction';
import InvalidAction from './actions/InvalidAction';
import NoAction from './actions/NoAction';
import { LeagueActionType } from './actions/LeagueAction';

export class DiscordCommand {
    readonly name: string;
    readonly description: string | undefined;
    readonly example: string | undefined;
    readonly action: (message: DiscordMessage) => Action;

    private static commands: { [name: string]: DiscordCommand } = {};

    static readonly PING = new DiscordCommand(
        '!ping',
        'Tests your connection to me!',
        '!ping',
        (message: DiscordMessage) => {
            return new PingAction(message);
        }
    );
    static readonly HELP = new DiscordCommand(
        '!help',
        'Returns the list of accepted commands, with descriptions.',
        '!help',
        (message: DiscordMessage) => {
            return new HelpAction(message);
        }
    );
    static readonly SUMMONER = new DiscordCommand(
        '!summoner',
        'Provides LoL details for the given summoner.',
        '!summoner Ace Damasos',
        (message: DiscordMessage) => {
            return new LeagueAction(message, LeagueActionType.SUMMONER);
        }
    );
    static readonly BANS = new DiscordCommand(
        '!bans',
        'Provides the latest optimal ban information for the given ELO.',
        '!bans platinum',
        (message: DiscordMessage) => {
            return new LeagueAction(message, LeagueActionType.BANS);
        }
    );
    static readonly YOUTUBE = new DiscordCommand(
        '!youtube',
        'Searches YouTube for the given query.',
        '!youtube Thomas the Dank Engine',
        (message: DiscordMessage) => {
            return new YouTubeAction(message);
        }
    );
    static readonly TWITCH = new DiscordCommand(
        '!twitch',
        'Searches Twitch for the given query.',
        '!twitch imaqtpie',
        (message: DiscordMessage) => {
            return new TwitchAction(message);
        }
    );
    static readonly INVALID = new DiscordCommand(
        '!invalid',
        undefined,
        undefined,
        (message: DiscordMessage) => {
            return new InvalidAction(message);
        }
    );
    static readonly NO_COMMAND = new DiscordCommand(
        '!noCommand',
        undefined,
        undefined,
        (message: DiscordMessage) => {
            return new NoAction(message);
        }
    );

    private constructor(name: string, description: string | undefined, example: string | undefined, action: (message: DiscordMessage) => Action) {
        this.name = name;
        this.description = description;
        this.example = example;
        this.action = action;

        DiscordCommand.commands[name] = this;
    }

    public static getCommands(): { [name: string]: DiscordCommand } {
        return DiscordCommand.commands;
    }

    public static parse(data: string): DiscordCommand {
        let command = DiscordCommand.commands[data];
        if (!command) {
            command = DiscordCommand.INVALID;
        }
        return command;
    }
}

export default DiscordCommand;
