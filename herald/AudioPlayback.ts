import { GuildMember } from "discord.js";
import ytdl from 'ytdl-core';
import Database from "./Database";

class AudioPlayback {
    private static instance: AudioPlayback;
    private defaultDuration = 15;
    private defaultVolume = 0.1;

    private constructor() {

    }

    public static getInstance() {
        if (!AudioPlayback.instance) {
            AudioPlayback.instance = new AudioPlayback();
        }
        return AudioPlayback.instance;
    }

    public async voiceStateUpdate(oldMember: GuildMember, newMember: GuildMember) {
        Database.getInstance().getTheme(newMember.id).then(async (themeInfo) => {
            if (!themeInfo) return;
            let link = String(themeInfo.link);
            let duration = Number(themeInfo.duration);
            let volume = Number(themeInfo.volume) / 100;
            let mute = false;

            if (mute) {
                // TODO: add muting functionality
            }
            if (newMember.voiceChannel !== oldMember.voiceChannel && newMember.voiceChannel) {
                let voiceChannel = newMember.voiceChannel;
                console.log(`${newMember.displayName} has joined ${newMember.voiceChannel.name}.`);
                try {
                    let connection = await voiceChannel.join();
                    let stream = ytdl(link);
                    let dispatcher = connection.playStream(stream);
                    dispatcher.on('start', () => {
                        setTimeout(() => {
                            dispatcher.end();
                            voiceChannel.leave();
                        }, (duration || this.defaultDuration) * 1000);
                    });
                    dispatcher.setVolume(volume || this.defaultVolume);
                } catch (e) {
                    console.log("Failed to join voice channel: " + e);
                    voiceChannel.leave();
                }
            }
            if (!newMember.voiceChannel) {
                console.log(`${newMember.displayName} has left ${oldMember.voiceChannel.name}.`);
                if (oldMember.voiceChannel && oldMember.voiceChannel.members.size <= 1) {
                    console.log(`Every one else left ${oldMember.voiceChannel.name}. Leaving too.`);
                    oldMember.voiceChannel.leave();
                }
            }
        });
    }
}

export default AudioPlayback;
