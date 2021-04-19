import * as Discord from 'discord.js';
import { TextChannel, DMChannel, GroupDMChannel, RichEmbed } from 'discord.js';
import DiscordMessage from './IncomingMessage';
import AudioPlayback from './AudioPlayback';

class Herald {
    private static instance: Herald;
    private client: Discord.Client;

    private constructor() {
        this.client = new Discord.Client();

        this.client.on('ready', () => {
            console.log('Discord Bot powered on.');
            this.client.user.setActivity("%help", {
                type: "PLAYING"
            });
        });

        this.client.on('message', (message) => {
            new DiscordMessage(message).executeAction()
        });

        this.client.on('voiceStateUpdate', async (oldMember, newMember) => {
            AudioPlayback.getInstance().voiceStateUpdate(oldMember, newMember);
        });
    }

    public login() {
        this.client.login(process.env.DISCORD);
    }

    public sendMessage(message: string | RichEmbed, channel: TextChannel | DMChannel | GroupDMChannel) {
        console.log("Sending message: " + message.toString());
        channel.send(message);
    }

    public static getInstance() {
        if (!Herald.instance) {
            Herald.instance = new Herald();
        }
        return Herald.instance;
    }
}

export default Herald;
