import Action from './Action2';
import DiscordBot from '../DiscordBot2';
import IncomingMessage from '../IncomingMessage2';

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
