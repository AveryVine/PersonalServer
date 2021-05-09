class ThemeInfo {
    userId: string;
    link: string;
    duration: number;
    volume: number;

    constructor(userId: string, link: string, duration: number, volume: number) {
        this.userId = userId;
        this.link = link;
        this.duration = duration;
        this.volume = volume;
    }
}

export default ThemeInfo;
