import Action from './Action';
import DiscordMessage from '../DiscordMessage';

class TwitchAction extends Action {
    args: string[];

    constructor(message: DiscordMessage) {
        super(message);
        this.args = message.getArgs();
    }

    public execute() {

    }
}

export default TwitchAction;
