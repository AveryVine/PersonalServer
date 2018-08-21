import Action from './Action';

class TwitchAction implements Action {
    args: string;

    constructor(args: string) {
        this.args = args;
    }

    public execute() {
        console.log("Received TWITCH action");
    }
}

export default TwitchAction;
