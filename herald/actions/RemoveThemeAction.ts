import Action from './Action';
import IncomingMessage from '../IncomingMessage';
import RichMessage from '../RichMessage';
import Herald from '../Herald';
import { RichEmbed, User } from 'discord.js';
import Database from '../Database';

class RemoveThemeAction implements Action, RichMessage {
    message: IncomingMessage;
    response: RichEmbed;
    targetUser: User;
    author: User;

    constructor(message: IncomingMessage) {
        this.message = message;
        this.response = new RichEmbed();
        this.targetUser = this.message.getMentions().users.first();
        this.author = this.message.getAuthor();
    }

    public execute() {
        let targetId = this.targetUser.id || this.author.id;
        console.log("Attempting to remove theme for user " + targetId);
        Database.getInstance().removeTheme(targetId);
        Herald.getInstance().sendMessage(this.createRichMessage(), this.message.getChannel());
    }

    public createRichMessage() {
        let user = this.targetUser || this.author;
        this.response.setTitle("Theme Removed");
        this.response.setDescription("${user.username}, you're all set! Your theme music was removed.");
        this.response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setTimestamp(new Date());
        return this.response;
    }
}

export default RemoveThemeAction;
