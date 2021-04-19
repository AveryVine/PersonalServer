import Action from './Action';
import IncomingMessage from '../IncomingMessage';

class NoAction implements Action {
    message: IncomingMessage;

    constructor(message: IncomingMessage) {
        this.message = message;
    }

    public execute() {
        console.log("No action to be executed.");
    }
}

export default NoAction;
