import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

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

    async findUserByEmail(email) {
        return await this.db.collection("users").findOne({ email: email });
    }

    async findUserByUsername(username) {
        return await this.db.collection("users").findOne({ username: username })
    }

    async findUser(id) {
        return await this.db.collection("users").findOne({id})
    }

    async storeUser(user) {
        return await this.db.collection("users").insertOne(user);
    }

    async storeTournament(tournament) {
        return await this.db.collection("tournaments").insertOne(tournament);
    }

    async getTournaments() {
        const tournamentsCursor = await this.db.collection("tournaments").find({});
        return tournamentsCursor.toArray();
    }

    async getTournament(id) {
        if (ObjectId.isValid(id)) {
            const objectId = new ObjectId(id);
            return await this.db.collection("tournaments").findOne({ _id: objectId });
        } else {
            return null;
        }
    }
}