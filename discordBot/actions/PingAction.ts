import Action from './Action';
import DiscordBot from '../DiscordBot';
import IncomingMessage from '../IncomingMessage'

class PingAction implements Action {
    message: IncomingMessage;

    constructor(message: IncomingMessage) {
        this.message = message;
    }

    public execute() {
        DiscordBot.getInstance().sendMessage("Pong", this.message.getChannel());
    }
}

export default PingAction;
