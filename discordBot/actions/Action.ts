import IncomingMessage from "../IncomingMessage";

interface Action {
    message: IncomingMessage;
    execute(): void;
}

export default Action;
