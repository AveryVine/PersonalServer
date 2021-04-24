import Action from './Action';
import IncomingMessage from '../IncomingMessage';
import RichMessage from '../RichMessage';
import Herald from '../Herald';
import { RichEmbed, User } from 'discord.js';
import Database from '../Database';

class DurationAction implements Action, RichMessage {
    message: IncomingMessage;
    response: RichEmbed;
    args: string[];
    targetUser: User;
    duration: Number;
    minDuration: Number;
    maxDuration: Number;

    constructor(message: IncomingMessage) {
        this.message = message;
        this.response = new RichEmbed();
        this.args = message.getArgs();
        this.targetUser = this.message.getMentions().users.first() || this.message.getAuthor();
        this.duration = -1;
        this.minDuration = 1;
        this.maxDuration = 30;
    }

    public execute() {
        console.log("Attempting to set theme duration for user " + this.targetUser.id + " with args: " + this.args.join(' '));
        let durationMatches = this.args.join('').match(/^0$|^-?[1-9]\d*(\.\d+)?$/);
        if (durationMatches) {
            let duration = durationMatches.join('');
            if (duration && +duration >= this.minDuration && +duration <= this.maxDuration) {
                this.duration = +duration;
                Database.getInstance().getTheme(this.targetUser.id).then((theme) => {
                    if (theme) {
                        Database.getInstance().setDuration(this.targetUser.id, this.duration);
                        Herald.getInstance().sendMessage(this.createRichMessage(true, ""), this.message.getChannel());
                    } else {
                        let errorMessage = "It looks like you don't have a theme set! Use `%addtheme` to get started."
                        Herald.getInstance().sendMessage(this.createRichMessage(false, errorMessage), this.message.getChannel());
                    }
                });
            } else {
                let errorMessage = "Make sure to provide a number of seconds between " + this.minDuration + " and " + this.maxDuration + ". For example: `%duration 20s` or `%duration 7`"
                Herald.getInstance().sendMessage(this.createRichMessage(false, errorMessage), this.message.getChannel());
            }
        } else {
            let errorMessage = "Make sure to provide a number of seconds between " + this.minDuration + " and " + this.maxDuration + ". For example: `%duration 20s` or `%duration 7`"
            Herald.getInstance().sendMessage(this.createRichMessage(false, errorMessage), this.message.getChannel());
        }
    }

    public createRichMessage(success: Boolean, errorMessage: string) {
        if (success) {
            let user = this.targetUser
            this.response.setTitle("Theme Duration Set");
            this.response.setDescription(`${user.username}, you're all set! Your theme music will play for ` + this.duration + ` seconds.`);
        } else {
            this.response.setTitle("Failed to Set Theme Duration");
            this.response.setDescription(`Whoops, the theme duration wasn't set! ` + errorMessage);
        }
        this.response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setTimestamp(new Date());
        return this.response;
    }
}

export default DurationAction;
