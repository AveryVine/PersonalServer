import Action from './Action2';
import DiscordBot from '../DiscordBot2';
import IncomingMessage from '../IncomingMessage2';
import search, { YouTubeSearchResults } from 'youtube-search';
import ApiKeys from '../../ApiKeys2';
import RichMessage from '../RichMessage2';
import { RichEmbed } from 'discord.js';

class YouTubeAction implements Action {
    message: IncomingMessage;
    args: string[];

    constructor(message: IncomingMessage) {
        this.message = message;
        this.args = message.getArgs();
    }

    public execute() {
        console.log("Searching YouTube with args: " + this.args.join(' '));
        search(
            this.args.join(' '),
            {
                maxResults: 1,
                key: ApiKeys.getInstance().getKeys().get('google')
            },
            (err: Error, results: YouTubeSearchResults[] | undefined) => {
                this.searchResults(err, results);
            }
        );
    }

    private searchResults(err: Error, results: YouTubeSearchResults[] | undefined) {
        let response: string | RichEmbed;

        if (!err && results) {
            let rawResult = results[0];
            if (rawResult) {
                let result = YouTubeEntity.valueOf(rawResult);
                if (result) {
                    response = result.createRichMessage();
                } else {
                    response = "Something went wrong!";
                }
            } else {
                response = "No results found.";
            }
        } else {
            console.log(err);
            response = "Something went wrong!";
        }

        DiscordBot.getInstance().sendMessage(response, this.message.getChannel());
    }
}

enum YouTubeEntityType {
    CHANNEL = "Channel",
    VIDEO = "Video",
    UNKNOWN = "Unknown"
}

abstract class YouTubeEntity implements RichMessage {
    type: YouTubeEntityType;
    channel: string;
    url: string;
    thumbnail: string | undefined;
    response: RichEmbed;

    protected constructor(result: YouTubeSearchResults) {
        this.type = YouTubeEntityType.UNKNOWN;
        this.channel = result.channelTitle;
        this.url = result.link;
        this.thumbnail = result.thumbnails.default ? result.thumbnails.default.url : undefined;
        this.response = new RichEmbed();
    }

    abstract createRichMessage(): RichEmbed;

    public static valueOf(result: YouTubeSearchResults): YouTubeEntity | undefined {
        switch (result.kind) {
            case "youtube#channel":
                return new YouTubeChannel(result);
            case "youtube#video":
                return new YouTubeVideo(result);
            default:
                return undefined;
        }
    }
}

class YouTubeChannel extends YouTubeEntity {
    public constructor(result: YouTubeSearchResults) {
        super(result);
        this.type = YouTubeEntityType.CHANNEL;
    }

    public createRichMessage() {
        this.response.setAuthor(this.channel.toUpperCase() + " - " + this.type);
        this.response.setColor(0xff0000);
        if (this.thumbnail) {
            this.response.setThumbnail(this.thumbnail);
        }
        this.response.setDescription("------------------------------");
        this.response.addField("Channel URL", this.url);
        this.response.setFooter("I am a bot, beep boop.", "https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697037-youtube-512.png");
        this.response.setTimestamp(new Date());

        return this.response;
    }
}

class YouTubeVideo extends YouTubeEntity {
    title: string;

    constructor(result: YouTubeSearchResults) {
        super(result);
        this.type = YouTubeEntityType.VIDEO;
        this.title = result.title;
    }

    public createRichMessage() {
        this.response.setAuthor(this.title.toUpperCase() + " - " + this.type);
        this.response.setColor(0xff0000);
        if (this.thumbnail) {
            this.response.setThumbnail(this.thumbnail);
        }
        this.response.setDescription("------------------------------");
        this.response.addField("Video URL", this.url);
        this.response.addField("Channel Name", this.channel);
        this.response.setFooter("I am a bot, beep boop.", "https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697037-youtube-512.png");
        this.response.setTimestamp(new Date());

        return this.response;
    }
}

export default YouTubeAction;
