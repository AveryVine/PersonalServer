import Action from './Action';

class NoAction implements Action {
    public execute() {
        console.log("Received NO action");
    }
}

export default NoAction;
