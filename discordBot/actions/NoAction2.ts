import Action from './Action2';
import IncomingMessage from '../IncomingMessage2';

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
