import Action from './actions/Action';
import PingAction from './actions/PingAction';
import HelpAction from './actions/HelpAction';
import AddThemeAction from './actions/AddThemeAction';
import LeagueAction from './actions/LeagueAction';
import YouTubeAction from './actions/YouTubeAction';
import TwitchAction from './actions/TwitchAction';
import NoAction from './actions/NoAction';
import { LeagueActionType } from './actions/LeagueAction';
import IncomingMessage from './IncomingMessage';
import RemoveThemeAction from './actions/RemoveThemeAction';
import ThemeAction from './actions/Theme';

export class Command {
    readonly name: string;
    readonly description: string | undefined;
    readonly example: string | undefined;
    readonly action: (message: IncomingMessage) => Action;

    private static commands: { [name: string]: Command } = {};

    static readonly PING = new Command(
        '%ping',
        'Tests your connection to me!',
        '%ping',
        (message: IncomingMessage) => {
            return new PingAction(message);
        }
    );
    static readonly HELP = new Command(
        '%help',
        'Returns the list of accepted commands, with descriptions.',
        '%help',
        (message: IncomingMessage) => {
            return new HelpAction(message);
        }
    );
    static readonly ADD_THEME = new Command(
        '%addtheme',
        'Sets the theme music that plays when you join a voice channel.',
        '%addtheme https://www.youtube.com/watch?v=2D-ZO2rGcSA',
        (message: IncomingMessage) => {
            return new AddThemeAction(message);
        }
    )
    static readonly REMOVE_THEME = new Command(
        '%removetheme',
        'Removes any theme music you may have set.',
        '%removetheme',
        (message: IncomingMessage) => {
            return new RemoveThemeAction(message);
        }
    )
    static readonly GET_THEME = new Command(
        '%theme',
        'Output the link to the theme assigned to you.',
        '%theme',
        (message: IncomingMessage) => {
            return new ThemeAction(message);
        }
    )
    static readonly NO_COMMAND = new Command(
        '%noCommand',
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
            command = Command.NO_COMMAND;
        }
        return command;
    }
}

export default Command;
