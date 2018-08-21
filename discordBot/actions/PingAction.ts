import Action from './Action';
import DiscordBot from '../DiscordBot';
import DiscordMessage from '../DiscordMessage'
import { RichEmbed, Message } from 'discord.js';

class PingAction extends Action {
    constructor(message: DiscordMessage) {
        super(message);
    }

    public execute() {
        DiscordBot.getInstance().sendMessage("Pong", this.message.getChannel());
    }
}

export default PingAction;
