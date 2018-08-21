import Action from './Action';

class HelpAction implements Action {
    public execute() {
        console.log("Received HELP action");
    }
}

export default HelpAction;
