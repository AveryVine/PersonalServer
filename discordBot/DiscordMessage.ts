import { Message, User } from 'discord.js'
import Action from './actions/Action';
import NoAction from './actions/NoAction';
import DiscordBotCommands from './DiscordBotCommands'

class DiscordMessage {
    private author: User;
    private rawContent: string;
    private type: DiscordBotCommands;
    private action: Action;

    constructor(message: Message) {
        this.author = message.author;
        this.rawContent = message.content.trim() + " ";
        this.type = DiscordBotCommands.NO_COMMAND;
        this.action = new NoAction();

        if (!this.authorIsBot() && this.rawContent.startsWith('!')) {
            let firstWord = this.rawContent.slice(1, this.rawContent.indexOf(' '));
            let args = this.rawContent.slice(this.rawContent.indexOf(' '), this.rawContent.length);
            this.type = DiscordBotCommands.parse(firstWord.toLowerCase());
            this.action = this.type.action.apply(args);
        }
    }

    public executeAction() {
        this.action.execute();
    }

    public authorIsBot() {
        return this.author.bot;
    }
}

export default DiscordMessage;
