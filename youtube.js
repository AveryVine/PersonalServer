const apiKeys = require('./apiKeys.js');
const request = require('request');
var search = require('youtube-search');
const Discord = require('discord.js');
const $ = module.exports;

var message = null;
var youtubeEntity = null;

class YouTubeEntity {
    constructor(title, kind, url, channel, thumbnail) {
        this.title = title;
        this.kind = kind;
        this.url = url;
        this.channel = channel;
        this.thumbnail = thumbnail;

        if (kind == "channel") {
            console.log("Created YouTubeChannel: " + title + " (" + url + ")");
        }
        else if (kind == "video") {
            console.log("Created YouTubeVideo: " + title + " (" + url + ")");
        }
        else {
            console.log("Created YouTubeEntity: " + title + " (" + url + ")");
        }
    }
}

$.search = function (messageObject, searchInput) {
    message = messageObject;
    console.log("Searching YouTube for: " + searchInput);
    var searchOptions = {
        maxResults: 1,
        key: apiKeys.google
    }
    search(searchInput, searchOptions, function (err, results) {
        if (err) {
            console.log("Something went wrong!\n" + err);
            sendMessage("Something went wrong!");
        } else {
            var entity = results[0];
            youtubeEntity = new YouTubeEntity(entity.title, entity.kind.replace('youtube#', ''), entity.link, entity.channelTitle, entity.thumbnails.high.url);
            sendEmbeddedMessage();
        }
    });
}

function sendEmbeddedMessage() {
    var embedFields = [];
    if (youtubeEntity.kind != "channel") {
        embedFields.push({
            name: "Channel Name",
            value: youtubeEntity.channel,
            inline: true
        });
        embedFields.push({
            name: "Video URL",
            value: youtubeEntity.url,
            inline: true
        });
    }
    else {
        embedFields.push({
            name: "Channel URL",
            value: youtubeEntity.url,
            inline: true
        });
    }
    var embedData = {
        author: {
            name: youtubeEntity.title.toUpperCase() + " - " + youtubeEntity.kind.charAt(0).toUpperCase() + youtubeEntity.kind.slice(1),
            icon_url: "https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697037-youtube-512.png"
        },
        color: 0xff0000,
        thumbnail: {
            url: youtubeEntity.thumbnail
        },
        description: "------------------------------",
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
    console.log("(" + new Date() + ") Sending message: " + reply);
    message.channel.send(reply);
}