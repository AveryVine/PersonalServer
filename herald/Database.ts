import { Client } from 'pg';

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
        let query = "select link from herald where userid='" + userId + "'";
        let result = await this.client.query(query);
        console.log("Retrieved theme for user " + userId + ": " + result.rows[0]);
        return result.rows[0];
    }

    public async addTheme(userId: String, youtubeLink: String) {
        let query = "insert into herald values('" + userId + "', '" + youtubeLink + "')";
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
}

export default Database;
