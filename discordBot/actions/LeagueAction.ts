import Action from './Action'
import DiscordMessage from '../DiscordMessage';

export enum LeagueActionType {
    SUMMONER = "summoner",
    BANS = "bans"
}

class LeagueAction extends Action {
    type: LeagueActionType;
    args: string[];

    constructor(message: DiscordMessage, type: LeagueActionType) {
        super(message);
        this.type = type;
        this.args = message.getArgs();
    }

    public execute() {
        console.log("Type: " + this.type.toString());
    }
}

export default LeagueAction;
