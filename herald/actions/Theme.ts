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
    author: User;
    theme: String | undefined;

    constructor(message: IncomingMessage) {
        this.message = message;
        this.response = new RichEmbed();
        this.targetUser = this.message.getMentions().users.first();
        this.author = this.message.getAuthor();
        this.theme = undefined;
    }

    public execute() {
        let targetId = this.targetUser.id || this.author.id;
        console.log("Attempting to get theme for user " + targetId);
        Database.getInstance().getTheme(targetId).then((theme) => {
            this.theme = String(theme.link);
            Herald.getInstance().sendMessage(this.createRichMessage(), this.message.getChannel());
        });
    }

    public createRichMessage() {
        let user = this.targetUser || this.author;
        this.response.setTitle("Theme");
        if (this.theme) {
            this.response.setDescription("${user.username}, your theme is: " + this.theme);
        } else {
            this.response.setDescription("${user.username}, you don't have a theme set.");
        }
        this.response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setTimestamp(new Date());
        return this.response;
    }
}

export default ThemeAction;
