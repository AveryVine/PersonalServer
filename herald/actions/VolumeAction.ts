import Action from './Action';
import IncomingMessage from '../IncomingMessage';
import RichMessage from '../RichMessage';
import Herald from '../Herald';
import { RichEmbed, User } from 'discord.js';
import Database from '../Database';

class VolumeAction implements Action, RichMessage {
    message: IncomingMessage;
    response: RichEmbed;
    args: string[];
    targetUser: User;
    volume: Number;
    minVolume: Number;
    maxVolume: Number;

    constructor(message: IncomingMessage) {
        this.message = message;
        this.response = new RichEmbed();
        this.args = message.getArgs();
        this.targetUser = this.message.getMentions().users.first() || this.message.getAuthor();
        this.volume = -1;
        this.minVolume = 1;
        this.maxVolume = 150;
    }

    public execute() {
        console.log("Attempting to set theme volume for user " + this.targetUser.id + " with args: " + this.args.join(' '));
        let volumeMatches = this.args.join('').match(/^0$|^-?[1-9]\d*(\.\d+)?$/);
        if (volumeMatches) {
            let volume = volumeMatches.join('');
            if (volume && +volume >= this.minVolume && +volume <= this.maxVolume) {
                this.volume = +volume;
                Database.getInstance().getTheme(this.targetUser.id).then((theme) => {
                    if (theme) {
                        Database.getInstance().setVolume(this.targetUser.id, this.volume);
                        Herald.getInstance().sendMessage(this.createRichMessage(true, ""), this.message.getChannel());
                    } else {
                        let errorMessage = "It looks like you don't have a theme set! Use `%addtheme` to get started.";
                        Herald.getInstance().sendMessage(this.createRichMessage(false, errorMessage), this.message.getChannel());
                    }
                });
            } else {
                let errorMessage = "Make sure to provide a volume between " + this.minVolume + " and " + this.maxVolume + ". For example: `%volume 100`";
                Herald.getInstance().sendMessage(this.createRichMessage(false, errorMessage), this.message.getChannel());
            }
        } else {
            let errorMessage = "Make sure to provide a volume between " + this.minVolume + " and " + this.maxVolume + ". For example: `%volume 100`";
            Herald.getInstance().sendMessage(this.createRichMessage(false, errorMessage), this.message.getChannel());
        }
    }

    public createRichMessage(success: Boolean, errorMessage: string) {
        if (success) {
            let user = this.targetUser
            this.response.setTitle("Theme Volume Set");
            this.response.setDescription(`${user.username}, you're all set! Your theme music will play at a volume of ` + this.volume + `%.`);
        } else {
            this.response.setTitle("Failed to Set Theme Volume");
            this.response.setDescription(`Whoops, the theme volume wasn't set! ` + errorMessage);
        }
        this.response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        this.response.setTimestamp(new Date());
        return this.response;
    }
}

export default VolumeAction;
