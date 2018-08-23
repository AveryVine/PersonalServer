import { TSMap } from 'typescript-map';

class ApiKeys {
    private discord: any;
    private riot: any;
    private championGG: any;
    private google: any;
    private twitch: any;

    private static instance: ApiKeys;

    private constructor() {
        this.discord = process.env.DISCORD;
        this.riot = process.env.RIOT;
        this.championGG = process.env.CHAMPION_GG;
        this.google = process.env.GOOGLE;
        this.twitch = process.env.TWITCH;
    }

    public getKeys(): TSMap<string, string> {
        return new TSMap([
            ['discord', this.discord],
            ['riot', this.riot],
            ['championGG', this.championGG],
            ['google', this.google],
            ['twitch', this.twitch]
        ]);
    }

    public static getInstance() {
        if (!ApiKeys.instance) {
            ApiKeys.instance = new ApiKeys();
        }
        return ApiKeys.instance;
    }
}

export default ApiKeys;
