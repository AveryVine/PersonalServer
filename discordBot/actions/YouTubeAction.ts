import Action from './Action';

class YouTubeAction implements Action {
    args: string;

    constructor(args: string) {
        this.args = args;
    }

    public execute() {
        console.log("Received YOUTUBE action");
    }
}

export default YouTubeAction;
