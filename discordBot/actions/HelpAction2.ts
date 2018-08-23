import Action from './Action2';
import IncomingMessage from '../IncomingMessage2';
import Command from '../Command2';
import RichMessage from '../RichMessage2';
import DiscordBot from '../DiscordBot2';
import { RichEmbed } from 'discord.js';

class HelpAction implements Action, RichMessage {
    message: IncomingMessage;
    response: RichEmbed;

    constructor(message: IncomingMessage) {
        this.message = message;
        this.response = new RichEmbed();
    }

    public execute() {
        DiscordBot.getInstance().sendMessage(this.createRichMessage(), this.message.getChannel());
    }

    public createRichMessage() {
        this.response.setAuthor("Hi, I'm Alfred!");
        this.response.setThumbnail("https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setDescription("------------------------------\nI'm a bot that can help you with many things, most of which being related to League of Legends. My available commands are listed below. Have fun!");

        let commands = Command.getCommands();
        for (let key in commands) {
            let command = commands[key];
            if (command.description) {
                let fieldValue = command.description;
                if (command.example) {
                    fieldValue += '\n\t- Example: "' + command.example + '"';
                }
                this.response.addField(command.name.replace('!', '').toUpperCase(), fieldValue, true);
            }
        }
        this.response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setTimestamp(new Date());

        return this.response;
    }
}

export default HelpAction;
