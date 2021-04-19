import Action from './Action';
import ApiKeys from '../../ApiKeys';
import Herald from '../Herald';
import RichMessage from '../RichMessage';
import IncomingMessage from '../IncomingMessage';
import request from 'request';
import http from 'http';
import { RichEmbed } from 'discord.js';

class TwitchAction implements Action {
    message: IncomingMessage;
    args: string[];
    channel: TwitchChannel | undefined;

    constructor(message: IncomingMessage) {
        this.message = message;
        this.args = message.getArgs();
        this.channel = undefined;
    }

    public execute() {
        console.log("Searching Twitch with args: " + this.args.join(' '));

        let channelSearchUrl = 'https://api.twitch.tv/kraken/search/channels?query=' + encodeURIComponent(this.args.join(' ')) + '&limit=1';
        this.search(channelSearchUrl, (err: http.ClientRequest, res: http.IncomingMessage, body: string) => {
            this.searchChannelResults(err, res, body);
        });
    }

    private search(url: string, callback: (err: http.ClientRequest, res: http.IncomingMessage, body: string) => void) {
        console.log("Searching URL: " + url);
        request(
            url,
            {
                headers: {
                    "Client-ID": ApiKeys.getInstance().getKeys().get('twitch'),
                    "Accept": "application/vnd.twitchtv.v5+json"
                }
            },
            callback
        )
    }

    private searchChannelResults(err: http.ClientRequest, res: http.IncomingMessage, body: string) {
        let response = undefined;

        if (!err && body) {
            let rawChannel = JSON.parse(body).channels[0];
            if (rawChannel) {
                this.channel = new TwitchChannel(rawChannel);
                let streamSearchUrl = 'https://api.twitch.tv/kraken/streams/' + this.channel.id;
                this.search(streamSearchUrl, (err: http.ClientRequest, res: http.IncomingMessage, body: string) => {
                    this.searchStreamResults(err, res, body);
                });
            } else {
                response = "No results found!";
            }
        } else {
            console.log("Failed to retrieve Twitch channel results");
            console.log(res.statusCode + " - " + body);
            response = "Something went wrong!";
        }

        if (response) {
            Herald.getInstance().sendMessage(response, this.message.getChannel());
        }
    }

    private searchStreamResults(err: http.ClientRequest, res: http.IncomingMessage, body: string) {
        let response: string | RichEmbed;

        if (!err && body && this.channel) {
            let rawStream = JSON.parse(body).stream;
            if (rawStream) {
                this.channel.setStatus(ChannelStatus.LIVE);
                this.channel.setStream(new TwitchStream(rawStream));
            }
            response = this.channel.createRichMessage();
        } else {
            console.log("Failed to retrieve Twitch stream results");
            console.log(res.statusCode + " - " + body);
            response = "Something went wrong!";
        }

        Herald.getInstance().sendMessage(response, this.message.getChannel());
    }
}

class TwitchChannel implements RichMessage {
    id: string;
    title: string;
    logo: string;
    url: string;
    message: string;
    messageCapped: string;
    status: ChannelStatus;
    stream: TwitchStream | undefined;
    response: RichEmbed;

    constructor(channel: any) {
        this.id = channel._id;
        this.title = channel.display_name;
        this.logo = channel.logo;
        this.url = channel.url;
        this.message = channel.status;
        this.status = ChannelStatus.OFFLINE;
        this.messageCapped = this.message;
        if (this.message.length > 50) {
            this.messageCapped = this.message.substring(0, 50) + "...";
        }
        this.stream = undefined;
        this.response = new RichEmbed();
    }

    public setStatus(status: ChannelStatus) {
        this.status = status;
    }

    public setStream(stream: TwitchStream) {
        this.stream = stream;
    }

    public createRichMessage() {
        this.response.setAuthor(this.title.toUpperCase() + " - " + this.status);
        this.response.setColor(0x9900ff);
        this.response.setThumbnail(this.stream ? this.stream.preview : this.logo);
        if (this.messageCapped.length > 0) {
            this.response.setDescription("------------------------------\n```" + this.messageCapped + "```")
        } else {
            this.response.setDescription("------------------------------");
        }
        if (this.status === ChannelStatus.LIVE && this.stream) {
            this.response.addField(this.stream.game, this.stream.viewers + " viewers", true);
        }
        this.response.addField("Stream URL", this.url, true);
        this.response.setFooter("I am a bot, beep boop.", "https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697028-twitch-512.png");
        this.response.setTimestamp(new Date());
        return this.response;
    }
}

class TwitchStream {
    game: string;
    viewers: string;
    preview: string;

    constructor(stream: any) {
        this.game = stream.game;
        this.viewers = stream.viewers;
        this.preview = stream.preview.large;
    }
}

enum ChannelStatus {
    LIVE = "Live",
    OFFLINE = "Offline"
}

export default TwitchAction;
