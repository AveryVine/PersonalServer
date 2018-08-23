import Action from './Action2';
import DiscordBot from '../DiscordBot2';
import IncomingMessage from '../IncomingMessage2';

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
