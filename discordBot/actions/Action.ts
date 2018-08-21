import DiscordMessage from "../DiscordMessage";

abstract class Action {
    message: DiscordMessage;
    abstract execute(): void;

    constructor(message: DiscordMessage) {
        console.log("Received " + message.getCommand().displayValue + " message with arguments: " + message.getArgs().toString());
        this.message = message;
    }
}

export default Action;
