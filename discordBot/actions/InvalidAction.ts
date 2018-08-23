import Action from './Action';
import DiscordBot from '../DiscordBot';
import IncomingMessage from '../IncomingMessage';

class InvalidAction implements Action {
    message: IncomingMessage;

    constructor(message: IncomingMessage) {
        this.message = message;
    }

    public execute() {
        DiscordBot.getInstance().sendMessage("That action doesn't exist! Try running \"!help\".", this.message.getChannel());
    }
}

export default InvalidAction;
