import { Message, User, TextChannel, DMChannel, GroupDMChannel, MessageMentions } from 'discord.js'
import Action from './actions/Action';
import Command from './Command';

class IncomingMessage {
    private author: User;
    private channel: TextChannel | DMChannel | GroupDMChannel;
    private mentions: MessageMentions;
    private rawContent: string[];
    private command: Command;
    private args: string[];
    private action: Action;

    constructor(message: Message) {
        this.author = message.author;
        this.channel = message.channel;
        this.mentions = message.mentions;
        this.rawContent = message.content.trim().split(' ').filter(content => content.length > 0);
        this.command = Command.NO_COMMAND;
        this.args = this.rawContent.slice(1, this.rawContent.length).filter(arg => !arg.startsWith("<@!"));

        if (!this.authorIsBot() && this.isCommand()) {
            this.command = Command.parse(this.rawContent[0]);
        }

        console.log("Received " + this.command.name + " action");

        this.action = this.command.action.call(this, this);
    }

    public executeAction() {
        try {
            this.action.execute();
        } catch(error) {
            console.log(error);
        }
    }

    public getChannel(): TextChannel | DMChannel | GroupDMChannel {
        return this.channel;
    }

    public getMentions(): MessageMentions {
        return this.mentions;
    }

    public getCommand(): Command {
        return this.command;
    }

    public getArgs(): string[] {
        return this.args;
    }

    public getAuthor() {
        return this.author;
    }

    public authorIsBot() {
        return this.author.bot;
    }

    private isCommand() {
        return this.rawContent[0] !== undefined && this.rawContent[0].startsWith('%');
    }
}

export default IncomingMessage;
