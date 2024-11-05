import { MongoClient } from "mongodb";

export class DbConnectionService {
    db;
    static instance;

    async init() {
        console.log("connecting to database...")
        const connectionString = process.env.DATABASE_CONNECTION_STRING || "";
        const client = new MongoClient(connectionString);
        let conn;
        
        try {
            conn = await client.connect();
            console.log("connection successful")
        } catch (e) {
            console.log("Error: Could not connect with database")
            console.error(e);
        }

        this.db = conn.db(process.env.DATABASE_NAME);
    }

    static async getInstance() {
        if (DbConnectionService.instance === undefined) {
            DbConnectionService.instance = new DbConnectionService();
            await DbConnectionService.instance.init();
        } 
        
        return DbConnectionService.instance;
    }
}