import Action from './Action'
import DiscordBot from '../DiscordBot';
import DiscordMessage from '../DiscordMessage';

export enum LeagueActionType {
    SUMMONER = "summoner",
    BANS = "bans"
}

class LeagueAction implements Action {
    message: DiscordMessage;
    args: string[];
    type: LeagueActionType;

    constructor(message: DiscordMessage, type: LeagueActionType) {
        this.message = message;
        this.args = message.getArgs();
        this.type = type;
    }

    public execute() {
        console.log("Type: " + this.type.toString());
        DiscordBot.getInstance().sendMessage("Feature coming soon!", this.message.getChannel());
    }
}

export default LeagueAction;
