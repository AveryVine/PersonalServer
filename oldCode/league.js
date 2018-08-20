const apiKeys = require('./apiKeys.js');
const request = require('request');
const Discord = require('discord.js');
const $ = module.exports;

var summoner = null;
var command = null;
var version = null;
var message = null;
var region = null;
var elo = null;
var options = {};

class Summoner {
    constructor(name, id, accountId, profileIconId, summonerLevel) {
        this.name = name;
        this.id = id;
        this.accountId = accountId;
        this.profileIconId = profileIconId;
        this.summonerLevel = summonerLevel;
        this.rank = [];
        console.log("Created summoner: " + name);
    }
}

$.bans = function (messageObject, content) {
    command = "bans";
    message = messageObject;
    region = "NA";
    elo = null;
    if (content != "") {
        elo = content.toUpperCase();
        if (elo != "BRONZE" && elo != "SILVER" && elo != "GOLD" && elo != "PLATINUM") {
            elo = null;
        }
    }
    else if (summoner) {
        for (i in summoner.rank) {
            if (summoner.rank[i].tier == "BRONZE" || summoner.rank[i].tier == "SILVER" || summoner.rank[i].tier == "GOLD" || summoner.rank[i].tier == "PLATINUM") {
                elo = summoner.rank[i].tier;
                console.log("Gathered ELO " + elo + " from " + summoner.rank[i].name + " for " + summoner.name);
                break;
            }
        }
    }
    console.log("Retrieving best bans" + (elo ? " for " + elo : ""));
    sendMessage("This feature is under construction.");
    //TODO: Gather bans from this point forward
}

$.summoner = function (messageObject, content) {
    command = "summoner";
    message = messageObject;
    region = "NA";
    if (content.includes('/')) {
        region = content.substring(content.indexOf('/') + 1, content.length);
        content = content.substring(0, content.indexOf('/')).trim();
    }
    var summonerName = content;
    console.log("Looking up " + summonerName);
    options.url = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + encodeURIComponent(summonerName);
    options.headers = {
        "X-Riot-Token": apiKeys.riot
    };
    console.log("Reaching out to " + options.url);
    request(options, summonerCallback);
}

function summonerCallback(error, response, body) {
    switch (response.statusCode) {
        case 200:
            var json = JSON.parse(body);
            summoner = new Summoner(json.name, json.id, json.accountId, json.profileIconId, json.summonerLevel);
            getSummonerIcon();
            break;
        case 403:
            console.log("API key expired\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("API key expired! Please contact the developer.");
            break;
        case 404:
            console.log("Summoner not found\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Invalid summoner name!");
            break;
        case 429:
            console.log("Rate limit exceeded\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Too many requests! Please try again later.");
            break;
        default:
            console.log("Something went wrong.\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Something went wrong!");
    }
}

function getSummonerIcon() {
    options.url = 'https://na1.api.riotgames.com/lol/static-data/v3/versions';
    options.headers = {
        "X-Riot-Token": apiKeys.riot
    };
    console.log("Reaching out to " + options.url);
    request(options, summonerIconCallback);
}

function summonerIconCallback(error, response, body) {
    switch (response.statusCode) {
        case 200:
            var json = JSON.parse(body);
            version = json[0];
            getRank();
            break;
        case 403:
            console.log("API key expired\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("API key expired! Please contact the developer.");
            break;
        case 429:
            console.log("Rate limit exceeded\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Too many requests! Please try again later.");
            break;
        default:
            console.log("Something went wrong.\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Something went wrong!");
    }
}

function getRank() {
    summoner.rank = [];
    options.url = 'https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/' + summoner.id;
    options.headers = {
        "X-Riot-Token": apiKeys.riot
    };
    console.log("Reaching out to " + options.url);
    request(options, rankCallback);
}

function rankCallback(error, response, body) {
    switch (response.statusCode) {
        case 200:
            var json = JSON.parse(body);
            for (i in json) {
                var queue = json[i];
                summoner.rank.push({
                    name: queue.queueType.split("_").join(" "),
                    tier: queue.tier,
                    rank: queue.rank,
                    leaguePoints: queue.leaguePoints
                });
            }
            console.log("Rank: " + summoner.rank.toString());
            sendEmbeddedMessage();
            break;
        case 403:
            console.log("API key expired\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("API key expired! Please contact the developer.");
            break;
        case 429:
            console.log("Rate limit exceeded\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Too many requests! Please try again later.");
            break;
        default:
            console.log("Something went wrong.\nCode: " + response.statusCode + "\nBody: " + body);
            sendMessage("Something went wrong!");
    }
}

function sendEmbeddedMessage() {
    var embedFields = [];
    for (i in summoner.rank) {
        var embedName = summoner.rank[i].name;
        var embedValue = summoner.rank[i].tier + " " + summoner.rank[i].rank + " (" + summoner.rank[i].leaguePoints + "lp)";
        embedFields.push({
            name: summoner.rank[i].name,
            value: summoner.rank[i].tier + " " + summoner.rank[i].rank + " (" + summoner.rank[i].leaguePoints + "lp)",
            inline: true
        });
    }
    var embedData = {
        author: {
            name: summoner.name.toUpperCase(),
            icon_url: "https://yt3.ggpht.com/-Ok8l1FqH6nk/AAAAAAAAAAI/AAAAAAAAAAA/NSlkTZ7supM/s100-c-k-no-mo-rj-c0xffffff/photo.jpg"
        },
        color: 0x116385,
        thumbnail: {
            url: "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/profileicon/" + summoner.profileIconId + ".png"
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
    console.log("(" + new Date() + ") Sending message to channel " + message.channel + ": " + reply);
    message.channel.send(reply);
}
