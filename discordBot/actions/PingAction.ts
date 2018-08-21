import Action from './Action';

class PingAction implements Action {
    public execute() {
        console.log("Received PING action");
    }
}

export default PingAction;
