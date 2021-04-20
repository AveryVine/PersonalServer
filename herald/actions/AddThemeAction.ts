import Action from './Action';
import IncomingMessage from '../IncomingMessage';
import RichMessage from '../RichMessage';
import Herald from '../Herald';
import { RichEmbed, User } from 'discord.js';
import Database from '../Database';

class AddThemeAction implements Action, RichMessage {
    message: IncomingMessage;
    response: RichEmbed;
    args: string[];
    targetUser: User;

    constructor(message: IncomingMessage) {
        this.message = message;
        this.response = new RichEmbed();
        this.args = message.getArgs();
        this.targetUser = this.message.getMentions().users.first() || this.message.getAuthor();
    }

    public execute() {
        console.log("Attempting to set theme for user " + this.targetUser.id + " with args: " + this.args.join(' '));
        if (this.args[0]) {
            Database.getInstance().getTheme(this.targetUser.id).then((existingTheme) => {
                if (existingTheme) {
                    Database.getInstance().updateTheme(this.targetUser.id, this.args[0]);
                    Herald.getInstance().sendMessage(this.createRichMessage(true), this.message.getChannel());
                } else {
                    Database.getInstance().addTheme(this.targetUser.id, this.args[0]);
                    Herald.getInstance().sendMessage(this.createRichMessage(true), this.message.getChannel());
                }
            });
        } else {
            Herald.getInstance().sendMessage(this.createRichMessage(false), this.message.getChannel());
        }
    }

    public createRichMessage(success: Boolean) {
        if (success) {
            let user = this.targetUser
            this.response.setTitle("Theme Set");
            this.response.setDescription("${user.username}, you're all set! Your theme music will play when you join a voice channel. The default duration is 15 seconds — to change the length, use `%duration`.");
        } else {
            this.response.setTitle("Failed to Set Theme");
            this.response.setDescription("Whoops, the theme wasn't set! Make sure to pass in a YouTube link. For example: `%addtheme https://www.youtube.com/watch?v=2D-ZO2rGcSA`");
        }
        this.response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setTimestamp(new Date());
        return this.response;
    }
}

export default AddThemeAction;
