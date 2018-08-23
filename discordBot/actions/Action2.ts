import IncomingMessage from "../IncomingMessage2";

interface Action {
    message: IncomingMessage;
    execute(): void;
}

export default Action;
