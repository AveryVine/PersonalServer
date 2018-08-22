import Action from './Action';
import DiscordBot from '../DiscordBot';
import DiscordMessage from '../DiscordMessage';
import search, { YouTubeSearchResults } from 'youtube-search';
import ApiKeys from '../../ApiKeys';
import DiscordRichMessage from '../DiscordRichMessage';
import { RichEmbed } from 'discord.js';

class YouTubeAction implements Action {
    message: DiscordMessage;
    args: string[];

    constructor(message: DiscordMessage) {
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
            this.searchResults
        );
    }

    private searchResults(err: Error, results: YouTubeSearchResults[] | undefined) {
        let response: string | RichEmbed;

        if (!err && results) {
            let rawResult = results[0];
            if (rawResult) {
                let result: YouTubeEntity;
                if (rawResult.kind.includes('channel')) {
                    result = new YouTubeChannel(rawResult.channelTitle, rawResult.link, rawResult.thumbnails.default ? rawResult.thumbnails.default.url : undefined);
                    response = result.createRichMessage();
                } else if (rawResult.kind.includes('video')) {
                    result = new YouTubeVideo(rawResult.title, rawResult.channelTitle, rawResult.link, rawResult.thumbnails.default ? rawResult.thumbnails.default.url : undefined);
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

interface YouTubeEntity extends DiscordRichMessage {
    kind: string;
    channel: string;
    url: string;
    thumbnail: string | undefined;
}

class YouTubeChannel implements YouTubeEntity {
    kind: string;
    channel: string;
    url: string;
    thumbnail: string | undefined;

    constructor(channel: string, url: string, thumbnail: string | undefined) {
        this.kind = "Channel";
        this.channel = channel;
        this.url = url;
        this.thumbnail = thumbnail;
    }

    public createRichMessage() {
        let response = new RichEmbed();
        response.setAuthor(this.channel.toUpperCase() + this.kind, "https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697037-youtube-512.png");
        response.setColor(0xff0000);
        if (this.thumbnail) {
            response.setThumbnail(this.thumbnail);
        }
        response.setDescription("------------------------------");
        response.addField("Channel URL", this.url);
        response.setFooter("I am a bot, beep boop.", "https://cdn.discordapp.com/embed/avatars/0.png");
        response.setTimestamp(new Date());
        return response;
    }
}

class YouTubeVideo implements YouTubeEntity {
    kind: string;
    title: string;
    channel: string;
    url: string;
    thumbnail: string | undefined;

    constructor(title: string, channel: string, url: string, thumbnail: string | undefined) {
        this.kind = "Video";
        this.title = title;
        this.channel = channel;
        this.url = url;
        this.thumbnail = thumbnail;
    }

    public createRichMessage() {
        let response = new RichEmbed();
        return response;
    }
}

export default YouTubeAction;
