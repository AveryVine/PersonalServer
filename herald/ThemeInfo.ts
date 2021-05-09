class ThemeInfo {
    userId: String;
    link: String;
    duration: Number;
    volume: Number;

    constructor(userId: String, link: String, duration: Number, volume: Number) {
        this.userId = userId;
        this.link = link;
        this.duration = duration;
        this.volume = volume;
    }
}

export default ThemeInfo;
