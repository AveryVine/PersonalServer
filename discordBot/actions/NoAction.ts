import Action from './Action';
import DiscordMessage from '../DiscordMessage';

class NoAction implements Action {
    message: DiscordMessage;

    constructor(message: DiscordMessage) {
        this.message = message;
    }

    public execute() {
        console.log("No action to be executed.");
    }
}

export default NoAction;
