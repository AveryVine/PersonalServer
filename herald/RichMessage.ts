import { RichEmbed } from 'discord.js';

interface RichMessage {
    response: RichEmbed;
    createRichMessage(success: Boolean): RichEmbed;
}

export default RichMessage;
