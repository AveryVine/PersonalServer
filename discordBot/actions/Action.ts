import DiscordMessage from "../DiscordMessage";

interface Action {
    message: DiscordMessage;
    execute(): void;
}

export default Action;
