import Action from './Action';
import DiscordMessage from '../DiscordMessage';

class HelpAction extends Action {
    constructor(message: DiscordMessage) {
        super(message);
    }

    public execute() {

    }
}

export default HelpAction;
