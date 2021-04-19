import Action from './Action';
import IncomingMessage from '../IncomingMessage';
import RichMessage from '../RichMessage';
import Herald from '../Herald';
import { RichEmbed } from 'discord.js';
import Database from '../Database';

class RemoveThemeAction implements Action, RichMessage {
    message: IncomingMessage;
    response: RichEmbed;

    constructor(message: IncomingMessage) {
        this.message = message;
        this.response = new RichEmbed();
    }

    public execute() {
        let authorId = this.message.getAuthorId()
        console.log("Attempting to remove theme for user " + authorId);
        Database.getInstance().removeTheme(authorId);
        Herald.getInstance().sendMessage(this.createRichMessage(), this.message.getChannel());
    }

    public createRichMessage() {
        this.response.setTitle("Theme Removed");
        this.response.setDescription("You're all set! Your theme music was removed.");
        this.response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setTimestamp(new Date());
        return this.response;
    }
}

export default RemoveThemeAction;
