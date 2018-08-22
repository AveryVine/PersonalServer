import Action from './Action';
import DiscordBot from '../DiscordBot';
import DiscordMessage from '../DiscordMessage';

class InvalidAction implements Action {
    message: DiscordMessage;

    constructor(message: DiscordMessage) {
        this.message = message;
    }

    public execute() {
        DiscordBot.getInstance().sendMessage("That action doesn't exist! Try running \"!help\".", this.message.getChannel());
    }
}

export default InvalidAction;
