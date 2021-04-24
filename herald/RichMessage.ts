import { RichEmbed } from 'discord.js';

interface RichMessage {
    response: RichEmbed;
    createRichMessage(success: Boolean, errorMessage: string): RichEmbed;
}

export default RichMessage;
