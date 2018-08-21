import Action from './Action';
import DiscordMessage from '../DiscordMessage';

class InvalidAction extends Action {
    constructor(message: DiscordMessage) {
        super(message);
    }
    public execute() {

    }
}

export default InvalidAction;
