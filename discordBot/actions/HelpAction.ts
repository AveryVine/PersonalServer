import Action from './Action';
import DiscordMessage from '../DiscordMessage';
import DiscordCommand from '../DiscordCommand';
import DiscordRichMessage from '../DiscordRichMessage';
import DiscordBot from '../DiscordBot';
import { RichEmbed } from 'discord.js';

class HelpAction implements Action, DiscordRichMessage {
    message: DiscordMessage;

    constructor(message: DiscordMessage) {
        this.message = message;
    }

    public execute() {
        DiscordBot.getInstance().sendMessage(this.createRichMessage(), this.message.getChannel());
    }

    public createRichMessage() {
        let response = new RichEmbed();
        response.setAuthor("Hi, I'm Alfred!", "https://cdn.discordapp.com/embed/avatars/0.png");
        response.setThumbnail("https://cdn.discordapp.com/embed/avatars/0.png");
        response.setDescription("------------------------------\nI'm a bot that can help you with many things, most of which being related to League of Legends. My available commands are listed below. Have fun!");

        let commands = DiscordCommand.getCommands();
        for (let key in commands) {
            let command = commands[key];
            if (command.description) {
                let fieldValue = command.description;
                if (command.example) {
                    fieldValue += '\n\t- Example: "' + command.example + '"';
                }
                response.addField(command.name.replace('!', '').toUpperCase(), fieldValue, true);
            }
        }
        response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        response.setTimestamp(new Date());

        return response;
    }
}

export default HelpAction;
