import Action from './Action';
import DiscordBot from '../DiscordBot';
import DiscordMessage from '../DiscordMessage'

class PingAction implements Action {
    message: DiscordMessage;

    constructor(message: DiscordMessage) {
        this.message = message;
    }

    public execute() {
        DiscordBot.getInstance().sendMessage("Pong", this.message.getChannel());
    }
}

export default PingAction;
