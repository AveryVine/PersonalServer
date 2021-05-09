import { GuildMember, VoiceChannel, VoiceConnection } from "discord.js";
import ytdl from 'ytdl-core';
import Database from "./Database";
import ThemeInfo from "./ThemeInfo";

interface QueuedTheme {
    themeInfo: ThemeInfo;
    voiceChannel: VoiceChannel;
}

class AudioPlayback {
    private static instance: AudioPlayback;
    private defaultDuration = 15;
    private defaultVolume = 100; // In %, from 1% to 150%
    private themeQueue: Array<QueuedTheme>;
    private connection: VoiceConnection | undefined;

    private constructor() {
        this.themeQueue = [];
        this.connection = undefined;
    }

    public static getInstance() {
        if (!AudioPlayback.instance) {
            AudioPlayback.instance = new AudioPlayback();
        }
        return AudioPlayback.instance;
    }

    private async playNextTheme() {
        let nextTheme = this.themeQueue.shift();
        if (!nextTheme) {
            if (this.connection) {
                this.connection.channel.leave()
            }
            this.connection = undefined;
            return;
        }
        let themeInfo = nextTheme.themeInfo;
        let voiceChannel = nextTheme.voiceChannel;
        console.log(`Next queued theme: ${themeInfo.link} (voice channel ${voiceChannel})`);
        try {
            if (!this.connection || this.connection.channel != voiceChannel) {
                this.connection = await voiceChannel.join();
            }
            let stream = ytdl(themeInfo.link);
            let dispatcher = this.connection.playStream(stream);
            dispatcher.setVolume((themeInfo.volume || this.defaultVolume) / 100);
            dispatcher.on('start', () => {
                setTimeout(() => {
                    dispatcher.end();
                    this.playNextTheme();
                }, (themeInfo.duration || this.defaultDuration) * 1000);
            });
        } catch (error) {
            console.log(`Something went wrong when trying to play ${themeInfo.link} (voice channel ${voiceChannel}): ${error}`);
            voiceChannel.leave();
            if (this.connection) {
                this.connection.channel.leave()
            }
            this.connection = undefined
        }
    }

    public async voiceStateUpdate(oldMember: GuildMember, newMember: GuildMember) {
        if (newMember.voiceChannel !== oldMember.voiceChannel && newMember.voiceChannel) {
            console.log(`${newMember.displayName} has joined ${newMember.voiceChannel.name}.`);
            Database.getInstance().getTheme(newMember.id).then(async (themeInfo) => {
                if (!themeInfo) return;
                let queuedTheme = { themeInfo: themeInfo, voiceChannel: newMember.voiceChannel };
                this.themeQueue.push(queuedTheme);
                console.log(`Theme queued: ${themeInfo.link}`);
                if (!this.connection) {
                    this.playNextTheme();
                } else {
                    console.log(`Not playing immediately, connection is currently established in channel ${this.connection.channel}`)
                }
            });
        }
        if (!newMember.voiceChannel) {
            console.log(`${newMember.displayName} has left ${oldMember.voiceChannel.name}.`);
            if (oldMember.voiceChannel && oldMember.voiceChannel.members.size <= 1) {
                this.playNextTheme();
            }
        }
    }
}

export default AudioPlayback;
