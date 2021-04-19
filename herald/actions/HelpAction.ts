import Action from './Action';
import IncomingMessage from '../IncomingMessage';
import Command from '../Command';
import RichMessage from '../RichMessage';
import Herald from '../Herald';
import { RichEmbed } from 'discord.js';

class HelpAction implements Action, RichMessage {
    message: IncomingMessage;
    response: RichEmbed;

    constructor(message: IncomingMessage) {
        this.message = message;
        this.response = new RichEmbed();
    }

    public execute() {
        Herald.getInstance().sendMessage(this.createRichMessage(), this.message.getChannel());
    }

    public createRichMessage() {
        this.response.setTitle("Help");
        this.response.setDescription("Hear ye! Hear ye! Get your own theme song to play when you join a voice channel, using the following commands.");

        let commands = Command.getCommands();
        let fields = [];
        for (let key in commands) {
            let command = commands[key];
            if (command.description) {
                let fieldValue = command.description;
                this.response.addField(command.name.toUpperCase(), fieldValue, true);
            }
        }
        this.response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setTimestamp(new Date());

        return this.response;
    }
}

export default HelpAction;
