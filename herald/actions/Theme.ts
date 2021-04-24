import Action from './Action';
import IncomingMessage from '../IncomingMessage';
import RichMessage from '../RichMessage';
import Herald from '../Herald';
import { RichEmbed, User } from 'discord.js';
import Database from '../Database';

class ThemeAction implements Action, RichMessage {
    message: IncomingMessage;
    response: RichEmbed;
    targetUser: User;
    themeInfo: any;

    constructor(message: IncomingMessage) {
        this.message = message;
        this.response = new RichEmbed();
        this.targetUser = this.message.getMentions().users.first() || this.message.getAuthor();
        this.themeInfo = undefined;
    }

    public execute() {
        console.log("Attempting to get theme for user " + this.targetUser.id);
        Database.getInstance().getTheme(this.targetUser.id).then((themeInfo) => {
            this.themeInfo = themeInfo
            Herald.getInstance().sendMessage(this.createRichMessage(), this.message.getChannel());
        });
    }

    public createRichMessage() {
        let user = this.targetUser;
        this.response.setTitle("Theme");
        if (this.themeInfo) {
            this.response.setDescription("${user.username}, your theme is: " + String(this.themeInfo.link) + " (playback duration: " + Number(this.themeInfo.duration) + " seconds)");
        } else {
            this.response.setDescription("${user.username}, you don't have a theme set.");
        }
        this.response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setTimestamp(new Date());
        return this.response;
    }
}

export default ThemeAction;
