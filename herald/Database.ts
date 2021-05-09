import { Client } from 'pg';
import ThemeInfo from './ThemeInfo';

class Database {
    private static instance: Database;
    private client: Client;

    private constructor() {
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
              rejectUnauthorized: false
            }
        });
    }

    public static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
            Database.instance.client.connect();
        }
        return Database.instance;
    }

    public async getTheme(userId: String) {
        let query = "select link, duration, volume from herald where userid='" + userId + "'";
        let result = await this.client.query(query);
        let themeInfo = result.rows[0] as ThemeInfo;
        if (themeInfo) {
            console.log("Retrieved theme for user " + userId + ": " + String(themeInfo.link) + " (duration " + Number(themeInfo.duration) + ", volume " + Number(themeInfo.volume) + ")");
        } else {
            console.log("No theme found for user " + userId);
        }
        return themeInfo;
    }

    public async addTheme(userId: String, youtubeLink: String) {
        let query = "insert into herald values('" + userId + "', '" + youtubeLink + "', 15)";
        await this.client.query(query);
        console.log("Added theme for user " + userId + ": " + youtubeLink);
    }

    public async updateTheme(userId: String, youtubeLink: String) {
        let query = "update herald set link='" + youtubeLink + "' where userid='" + userId + "'";
        await this.client.query(query);
        console.log("Updated theme for user " + userId + ": " + youtubeLink);
    }

    public async removeTheme(userId: String) {
        let query = "delete from herald where userid='" + userId + "'";
        await this.client.query(query);
        console.log("Removed theme for user " + userId);
    }

    public async setDuration(userId: String, duration: Number) {
        let query = "update herald set duration=" + duration + " where userid='" + userId + "'";
        await this.client.query(query);
        console.log("Updated duration for user " + userId + ": " + duration);
    }

    public async setVolume(userId: String, volume: Number) {
        let query = "update herald set volume=" + volume + " where userid='" + userId + "'";
        await this.client.query(query);
        console.log("Updated volume for user " + userId + ": " + volume);
    }
}

export default Database;
