import * as Discord from 'discord.js';

class DiscordBot {
    client: Discord.Client;

    constructor() {
        this.client = new Discord.Client();
    }
}

export default DiscordBot;
