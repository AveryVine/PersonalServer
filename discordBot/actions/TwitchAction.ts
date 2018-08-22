import Action from './Action';
import DiscordBot from '../DiscordBot';
import IncomingMessage from '../IncomingMessage';

class TwitchAction implements Action {
    message: IncomingMessage;
    args: string[];

    constructor(message: IncomingMessage) {
        this.message = message;
        this.args = message.getArgs();
    }

    public execute() {
        DiscordBot.getInstance().sendMessage("Feature coming soon!", this.message.getChannel());
    }
}

export default TwitchAction;
