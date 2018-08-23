import { RichEmbed } from 'discord.js';

interface RichMessage {
    response: RichEmbed;
    createRichMessage(): RichEmbed;
}

export default RichMessage;
