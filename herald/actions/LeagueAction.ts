import Action from './Action'
import Herald from '../Herald';
import IncomingMessage from '../IncomingMessage';

export enum LeagueActionType {
    SUMMONER = "summoner",
    BANS = "bans"
}

class LeagueAction implements Action {
    message: IncomingMessage;
    args: string[];
    type: LeagueActionType;

    constructor(message: IncomingMessage, type: LeagueActionType) {
        this.message = message;
        this.args = message.getArgs();
        this.type = type;
    }

    public execute() {
        console.log("Type: " + this.type.toString());
        Herald.getInstance().sendMessage("Feature coming soon!", this.message.getChannel());
    }
}

export default LeagueAction;
