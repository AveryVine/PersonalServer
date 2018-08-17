const apiKeys = require('./apiKeys.js');
const league = require('./league.js');
const youtube = require('./youtube.js');
const twitch = require('./twitch.js');
const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();
const $ = module.exports;

client.on('ready', () => {
	console.log('Discord Bot powered on.');
});

client.on('message', message => {
	const commands = {
		"help": function () { help(message) },
		"summoner": function () { league.summoner(message, content) },
		"bans": function () { league.bans(message, content) },
		"youtube": function () { youtube.search(message, content) },
		"twitch": function () { twitch.searchChannels(message, content) }
	};

	if (!message.author.bot) {
		if (message.content.startsWith("!")) {
			var content = message.content.slice(1);
			console.log("Received message: " + content);
			if (content.toLowerCase() === 'ping') {
				sendMessage('pong', message);
			} else {
				var command = content;
				if (content.includes(' ')) {
					command = content.slice(0, content.indexOf(' ')).trim();
				}
				if (commands[command]) {
					content = content.slice(command.length + 1).trim();
					commands[command]();
				}
			}
		}
	}
});

function loadApiKeysFromProcess() {
	apiKeys.discord = process.env.discord;
	apiKeys.riot = process.env.riot;
	apiKeys.championGG = process.env.championGG;
	apiKeys.google = process.env.google;
	apiKeys.twitchId = process.env.twitchId;

	apiKeys.startBot = process.env.startBot;
}

function help(message) {
	var embedFields = [];
	embedFields.push({
		name: "PING",
		value: "Tests your connection to me!\n\t- Example: \"!ping\"",
		inline: true
	});
	embedFields.push({
		name: "HELP",
		value: "Returns the list of accepted commands, with descriptions.\n\t- Example: \"!help\"",
		inline: true
	});
	embedFields.push({
		name: "SUMMONER",
		value: "Provides details for the given summoner.\n\t- Required Input: the summoner name to look up\n\t- Example: \"!summoner Ace Damasos\"",
		inline: true
	});
	embedFields.push({
		name: "TWITCH",
		value: "Searches Twitch for the given query.\n\t- Required Input: a query to search for\n\t- Example: \"!twitch imaqtpie\"",
		inline: true
	});
	embedFields.push({
		name: "YOUTUBE",
		value: "Searches YouTube for the given query.\n\t- Required Input: a query to search for\n\t- Example: \"!youtube Thomas the Dank Engine\"",
		inline: true
	});
    var embedData = {
        author: {
            name: "Hi, I'm Alfred.",
            icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        thumbnail: {
            url: "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        description: "------------------------------\nI'm a bot that can help you with many things, most of which being related to League of Legends. My available commands are listed below. Have fun!",
        fields: embedFields,
        footer: {
            icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
            text: "I am a bot, beep boop."
        },
    };
    embedData.timestamp = new Date();
    var data = new Discord.RichEmbed(embedData);
    sendMessage(data, message);
}

function sendMessage(reply, message) {
    console.log("(" + new Date() + ") Sending message: " + reply);
    message.channel.send(reply);
}

$.startBot = function () {
	loadApiKeysFromProcess();
	if (apiKeys.startBot == "true") {
		client.login(apiKeys.discord);
	}
}