import Action from './Action';

class InvalidAction implements Action {
    public execute() {
        console.log("Received INVALID action");
    }
}

export default InvalidAction;
