import Action from './Action';
import DiscordBot from '../DiscordBot';
import DiscordMessage from '../DiscordMessage';

class YouTubeAction implements Action {
    message: DiscordMessage;
    args: string[];

    constructor(message: DiscordMessage) {
        this.message = message;
        this.args = message.getArgs();
    }

    public execute() {
        DiscordBot.getInstance().sendMessage("Feature coming soon!", this.message.getChannel());
    }
}

interface YouTubeEntity extends DiscordResponse {
    channel: string;
    url: string;
    thumbnail: string;
}

class YouTubeChannel implements YouTubeEntity {
    channel: string;
    url: string;
    thumbnail: string;

    constructor(channel: string, url: string, thumbnail: string) {
        this.channel = channel;
        this.url = url;
        this.thumbnail = thumbnail;
    }

    public sendAsMessage() {

    }
}

class YouTubeVideo implements YouTubeEntity{
    title: string;
    channel: string;
    url: string;
    thumbnail: string;

    constructor(title: string, channel: string, url: string, thumbnail: string) {
        this.title = title;
        this.channel = channel;
        this.url = url;
        this.thumbnail = thumbnail;
    }

    public sendAsMessage() {

    }
}

export default YouTubeAction;
