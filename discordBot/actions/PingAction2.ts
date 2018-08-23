import Action from './Action2';
import DiscordBot from '../DiscordBot2';
import IncomingMessage from '../IncomingMessage2'

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
