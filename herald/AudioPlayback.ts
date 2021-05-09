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
            console.log(`No theme queued.`);
            if (this.connection) {
                console.log(`Disconnecting from ${this.connection.channel.name}.`);
                this.connection.disconnect();
                this.connection = undefined;
            }
            return;
        }
        let themeInfo = nextTheme.themeInfo;
        let voiceChannel = nextTheme.voiceChannel;
        console.log(`Preparing to play next queued theme: ${themeInfo.link} (voice channel ${voiceChannel.name})`);
        try {
            if (!this.connection || this.connection.channel != voiceChannel) {
                console.log(`Not currently in a voice channel, or currently in a different one. Joining ${voiceChannel.name}.`);
                this.connection = await voiceChannel.join();
            }
            let stream = ytdl(themeInfo.link);
            let dispatcher = this.connection.playStream(stream);
            dispatcher.setVolume((themeInfo.volume || this.defaultVolume) / 100);
            dispatcher.on('start', () => {
                setTimeout(() => {
                    console.log(`Completed playback of current theme.`)
                    dispatcher.end();
                    if (this.connection && this.connection.channel !== voiceChannel) {
                        console.log(`Switched mid-playback from ${voiceChannel.name} to ${this.connection.channel.name}. Don't try to play another theme, one should already be playing!`)
                    } else {
                        this.playNextTheme();
                    }
                }, (themeInfo.duration || this.defaultDuration) * 1000);
            });
        } catch (error) {
            console.log(`Something went wrong when trying to play ${themeInfo.link} (voice channel ${voiceChannel.name}): ${error}`);
            this.playNextTheme();
        }
    }

    public async voiceStateUpdate(oldMember: GuildMember, newMember: GuildMember) {
        let startImmediately = false;
        if (!newMember.voiceChannel || (oldMember.voiceChannel && oldMember.voiceChannel !== newMember.voiceChannel)) {
            console.log(`${newMember.displayName} has left ${oldMember.voiceChannel.name}.`);
            if (oldMember.voiceChannel && oldMember.voiceChannel.members.size <= 1) {
                console.log(`No other members in ${oldMember.voiceChannel.name}. Leaving too.`);
                if (!newMember.voiceChannel) {
                    oldMember.voiceChannel.leave();
                    this.connection = undefined;
                } else {
                    startImmediately = true;
                }
            }
        }
        if (newMember.voiceChannel !== oldMember.voiceChannel && newMember.voiceChannel) {
            console.log(`${newMember.displayName} has joined ${newMember.voiceChannel.name}.`);
            Database.getInstance().getTheme(newMember.id).then(async (themeInfo) => {
                if (!themeInfo) return;
                let queuedTheme = { themeInfo: themeInfo, voiceChannel: newMember.voiceChannel };
                this.themeQueue.push(queuedTheme);
                console.log(`Theme queued: ${themeInfo.link}`);
                if (!this.connection || startImmediately) {
                    this.playNextTheme();
                } else {
                    console.log(`Not playing immediately, connection is currently established in channel ${this.connection.channel.name}`)
                }
            });
        }
    }
}

export default AudioPlayback;
