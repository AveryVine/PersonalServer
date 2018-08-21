import Action from './Action';
import DiscordMessage from '../DiscordMessage';

class NoAction extends Action {
    constructor(message: DiscordMessage) {
        super(message);
    }

    public execute() {
        console.log("Received NO action");
    }
}

export default NoAction;
