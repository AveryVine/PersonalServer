import PingAction from './actions/PingAction';
import HelpAction from './actions/HelpAction';
import LeagueAction from './actions/LeagueAction';
import YouTubeAction from './actions/YouTubeAction';
import TwitchAction from './actions/TwitchAction';
import InvalidAction from './actions/InvalidAction';
import NoAction from './actions/NoAction';
import { LeagueActionType } from './actions/LeagueAction';

class DiscordBotCommand {
    readonly displayValue: string;
    readonly action: Function;

    private static AllValues: { [name: string]: DiscordBotCommand } = {};

    static readonly PING = new DiscordBotCommand('ping', () => {
        return new PingAction();
    });
    static readonly HELP = new DiscordBotCommand('help', () => {
        return new HelpAction();
    });
    static readonly SUMMONER = new DiscordBotCommand('summoner', (args: string) => {
        return new LeagueAction(LeagueActionType.SUMMONER, args);
    });
    static readonly BANS = new DiscordBotCommand('bans', (args: string) => {
        return new LeagueAction(LeagueActionType.BANS, args);
    });
    static readonly YOUTUBE = new DiscordBotCommand('youtube', (args: string) => {
        return new YouTubeAction(args);
    });
    static readonly TWITCH = new DiscordBotCommand('twitch', (args: string) => {
        return new TwitchAction(args);
    });
    static readonly INVALID = new DiscordBotCommand('invalid', () => {
        return new InvalidAction();
    });
    static readonly NO_COMMAND = new DiscordBotCommand('noCommand', () => {
        return new NoAction();
    });

    private constructor(displayValue: string, action: Function) {
        this.displayValue = displayValue;
        this.action = action;

        DiscordBotCommand.AllValues[displayValue] = this;
    }

    public static parse(data: string): DiscordBotCommand {
        let command = DiscordBotCommand.AllValues[data];
        if (!command) {
            command = DiscordBotCommand.INVALID;
        }
        return command;
    }
}

export default DiscordBotCommand;
