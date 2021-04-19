import Action from './Action';
import Herald from '../Herald';
import IncomingMessage from '../IncomingMessage'

class PingAction implements Action {
    message: IncomingMessage;

    constructor(message: IncomingMessage) {
        this.message = message;
    }

    public execute() {
        Herald.getInstance().sendMessage("Pong", this.message.getChannel());
    }
}

export default PingAction;
