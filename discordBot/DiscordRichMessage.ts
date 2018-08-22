import { RichEmbed } from 'discord.js';

interface DiscordRichMessage {
    createRichMessage(): RichEmbed;
}

export default DiscordRichMessage;
