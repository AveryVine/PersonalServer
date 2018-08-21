import * as Discord from 'discord.js'
import DiscordMessage from './DiscordMessage'
import ApiKeys from '../ApiKeys';

class DiscordBot {
    client: Discord.Client;

    constructor() {
        this.client = new Discord.Client();

        this.client.on('ready', () => {
            console.log('Discord Bot powered on.');
        });

        this.client.on('message', (message) => {
            new DiscordMessage(message).executeAction()
        });

        this.client.login(ApiKeys.getInstance().getKeys().get('discord'));
    }
}

export default DiscordBot;
