import Action from './Action';
import DiscordBot from '../DiscordBot';
import DiscordMessage from '../DiscordMessage';

class TwitchAction implements Action {
    message: DiscordMessage;
    args: string[];

    constructor(message: DiscordMessage) {
        this.message = message;
        this.args = message.getArgs();
    }

    public execute() {
        DiscordBot.getInstance().sendMessage("Feature coming soon!", this.message.getChannel());
    }
}

export default TwitchAction;
