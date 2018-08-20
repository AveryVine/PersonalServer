const apiKeys = require('./apiKeys.js');
const request = require('request');
const Discord = require('discord.js');
const $ = module.exports;

var message = null;
var options = {};
var twitchStream = null;

class TwitchChannel {
    constructor(id, displayName, logo, url, message) {
        this.id = id;
        this.displayName = displayName;
        this.logo = logo;
        this.url = url;
        this.message = message;

        this.status = "Offline";
        this.messageCapped = this.message;
        if (message.length > 50) {
            this.messageCapped = this.message.substring(0, 50) + "...";
        }
        this.game = "None";
        this.viewers = 0;
        this.preview = null;

        console.log("Created TwitchChannel: " + displayName + " (" + url + ")");
    }
}

$.searchChannels = function (messageObject, searchInput) {
    message = messageObject;
    console.log("Searching Twitch channels for: " + searchInput);
    options.url = 'https://api.twitch.tv/kraken/search/channels?query=' + encodeURIComponent(searchInput) + '&limit=1';
    options.headers = {
        "Client-ID": apiKeys.twitchId,
        "Accept": "application/vnd.twitchtv.v5+json"
    };
    console.log("Reaching out to " + options.url);
    request(options, searchChannelsCallback);
}

function searchChannelsCallback(error, response, body) {
    switch (response.statusCode) {
        case 200:
            var json = JSON.parse(body);
            var channel = json.channels[0];
            if (channel) {
                twitchChannel = new TwitchChannel(channel._id, channel.display_name, channel.logo, channel.url, channel.status);
                searchStreams();
            }
            else {
                console.log("No channels found!");
                sendMessage("No results found!");
            }
            break;
        case 401:
            console.log("Unauthorized\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Something went wrong!");
            break;
        default:
            console.log("Something went wrong!\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Something went wrong!");
    }
}

function searchStreams() {
    console.log("Searching for Twitch streams by " + twitchChannel.displayName);
    options.url = 'https://api.twitch.tv/kraken/streams/' + twitchChannel.id;
    options.headers = {
        "Client-ID": apiKeys.twitchId,
        "Accept": "application/vnd.twitchtv.v5+json"
    };
    console.log("Reaching out to " + options.url);
    request(options, searchStreamsCallback);
}

function searchStreamsCallback(error, response, body) {
    switch (response.statusCode) {
        case 200:
            var json = JSON.parse(body);
            var stream = json.stream;
            if (stream) {
                console.log("Stream found");
                var channel = stream.channel;
                twitchChannel.status = "Live";
                twitchChannel.game = stream.game;
                twitchChannel.viewers = stream.viewers;
                twitchChannel.preview = stream.preview.large;
            }
            sendEmbeddedMessage();
            break;
        case 401:
            console.log("Unauthorized\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Something went wrong!");
            break;
        default:
            console.log("Something went wrong!\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Something went wrong!");
    }
}

function sendEmbeddedMessage() {
    var embedFields = [];
    if (twitchChannel.status == "Live") {
        embedFields.push({
            name: twitchChannel.game,
            value: twitchChannel.viewers + " viewers",
            inline: true
        });
    }
    embedFields.push({
        name: "Stream URL",
        value: twitchChannel.url,
        inline: true
    })
    var embedData = {
        author: {
            name: twitchChannel.displayName.toUpperCase() + " - " + twitchChannel.status,
            icon_url: "https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697028-twitch-512.png"
        },
        color: 0x9900ff,
        thumbnail: {
            url: (twitchChannel.preview ? twitchChannel.preview : twitchChannel.logo)
        },
        description: "------------------------------\n```" + twitchChannel.messageCapped + "```",
        fields: embedFields,
        footer: {
            icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
            text: "I am a bot, beep boop."
        },
    };
    embedData.timestamp = new Date();
    var data = new Discord.RichEmbed(embedData);
    sendMessage(data);
}

function sendMessage(reply) {
    console.log("(" + new Date() + ") Sending message to channel " + message.channel + ": " + reply);
    message.channel.send(reply);
}
