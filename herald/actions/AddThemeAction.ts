import Action from './Action';
import IncomingMessage from '../IncomingMessage';
import RichMessage from '../RichMessage';
import Herald from '../Herald';
import { RichEmbed } from 'discord.js';
import Database from '../Database';

class AddThemeAction implements Action, RichMessage {
    message: IncomingMessage;
    response: RichEmbed;
    args: string[];

    constructor(message: IncomingMessage) {
        this.message = message;
        this.response = new RichEmbed();
        this.args = message.getArgs();
    }

    public execute() {
        let authorId = this.message.getAuthorId()
        console.log("Attempting to set theme for user " + authorId + " with args: " + this.args.join(' '));
        if (this.args[0]) {
            Database.getInstance().getTheme(authorId).then((existingTheme) => {
                if (existingTheme) {
                    Database.getInstance().updateTheme(authorId, this.args[0]);
                    Herald.getInstance().sendMessage(this.createRichMessage(true), this.message.getChannel());
                } else {
                    Database.getInstance().addTheme(authorId, this.args[0]);
                    Herald.getInstance().sendMessage(this.createRichMessage(true), this.message.getChannel());
                }
            });
        } else {
            Herald.getInstance().sendMessage(this.createRichMessage(false), this.message.getChannel());
        }
    }

    public createRichMessage(success: Boolean) {
        if (success) {
            this.response.setTitle("Theme Set");
            this.response.setDescription("You're all set! Your theme music will play when you join a voice channel. The default duration is 15 seconds — to change the length, use `%duration`.");
        } else {
            this.response.setTitle("Failed to Set Theme");
            this.response.setDescription("Whoops, your theme wasn't set! Make sure you pass in a YouTube link. For example: `%addtheme https://www.youtube.com/watch?v=2D-ZO2rGcSA`");
        }
        this.response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setTimestamp(new Date());
        return this.response;
    }
}

export default AddThemeAction;
