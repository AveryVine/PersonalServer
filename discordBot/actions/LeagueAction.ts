import Action from './Action'

export enum LeagueActionType {
    SUMMONER = "summoner",
    BANS = "bans"
}

class LeagueAction implements Action {
    type: LeagueActionType;
    args: string;

    constructor(type: LeagueActionType, args: string) {
        this.type = type;
        this.args = args;
    }

    public execute() {
        console.log("Received LEAGUE " + this.type.toString() + " action");
    }
}

export default LeagueAction;
