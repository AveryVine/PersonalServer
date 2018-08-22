import * as Discord from 'discord.js';
import { TextChannel, DMChannel, GroupDMChannel, RichEmbed } from 'discord.js';
import DiscordMessage from './DiscordMessage';
import ApiKeys from '../ApiKeys';

class DiscordBot {
    private static instance: DiscordBot;
    private client: Discord.Client;

    private constructor() {
        this.client = new Discord.Client();

        this.client.on('ready', () => {
            console.log('Discord Bot powered on.');
        });

        this.client.on('message', (message) => {
            new DiscordMessage(message).executeAction()
        });
    }

    public login() {
        this.client.login(ApiKeys.getInstance().getKeys().get('discord'));
    }

    public sendMessage(message: string | RichEmbed, channel: TextChannel | DMChannel | GroupDMChannel) {
        console.log("Sending message: " + message.toString());
        channel.send(message);
    }

    public static getInstance() {
        if (!DiscordBot.instance) {
            DiscordBot.instance = new DiscordBot();
        }
        return DiscordBot.instance;
    }
}

export default DiscordBot;
