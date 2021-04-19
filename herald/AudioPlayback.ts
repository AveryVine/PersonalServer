import { GuildMember } from "discord.js";
import ytdl from 'ytdl-core';
import Database from "./Database";

class AudioPlayback {
    private static instance: AudioPlayback;
    private defaultLength = 15;
    private defaultVolume = 100;

    private constructor() {

    }

    public static getInstance() {
        if (!AudioPlayback.instance) {
            AudioPlayback.instance = new AudioPlayback();
        }
        return AudioPlayback.instance;
    }

    public async voiceStateUpdate(oldMember: GuildMember, newMember: GuildMember) {
        Database.getInstance().getTheme(newMember.id).then(async (song) => {
            let length: any = undefined;
            let volume: any = undefined;
            let mute = false;

            if (!song) return;
            if (mute) {
                // TODO: add muting functionality
            }
            if (newMember.voiceChannel !== oldMember.voiceChannel && newMember.voiceChannel) {
                let voiceChannel = newMember.voiceChannel;
                console.log(`${newMember.displayName} has joined ${newMember.voiceChannel.name}.`);
                let connection = await voiceChannel.join();
                let stream = ytdl(song.link);
                let dispatcher = connection.playStream(stream);
                dispatcher.on('start', () => {
                    if (length !== -1) {
                        setTimeout(() => {
                            dispatcher.end();
                        }, (length || this.defaultLength) * 1000);
                    }
                });
                dispatcher.setVolume(volume || this.defaultVolume);
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
