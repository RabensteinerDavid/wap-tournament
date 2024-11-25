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

    async storeRefreshToken(email, refreshToken) {
        await this.db.collection("refresh-tokens").insertOne({ email, refreshToken });
    }

    async verifyRefreshToken(email, refreshToken) {
        const token = await this.db.collection("refresh-tokens").findOne({ email, refreshToken });
        return !!token;
    }
    
    async findUserByEmail(email) {
        return await this.db.collection("users").findOne({ email: email });
    }

    async findUserByUsername(username) {
        return await this.db.collection("users").findOne({ username: username })
    }

    async findUserByVerificationToken(verifyToken) {
        return await this.db.collection("users").findOne({
            "verificationToken.token": verifyToken
        });
    }

    async updateUser(user) {
        const objectId = new ObjectId(user._id);
        const filter = { _id: objectId };
        const update = { $set: user };

        return await this.db.collection("users").updateOne(filter, update);
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

    async deleteTournament(id) {
        if (ObjectId.isValid(id)) {
            const objectId = new ObjectId(id);
            return await this.db.collection("tournaments").deleteMany({ _id: objectId });
        } else {
            return null;
        }
    }

    async finishGroupPhaseOfTournament(id) {
        if (ObjectId.isValid(id)) {
            const objectId = new ObjectId(id);
            const filter = { _id: objectId };
            const tournament = await this.db.collection("tournaments").findOne(filter);

            if (tournament && !tournament.isGroupPhaseDone) {
                let bestParticipants = [];
                for (let i = 0; i < tournament.groups.length; i++) {
                    const sortedGroup = this.sortByResults(tournament.groups[i]);
                    bestParticipants = [...bestParticipants, ...sortedGroup.participants.slice(0, 2)];
                }

                let bracketIndex = tournament.brackets.length - 1;
                for (let i = 0; i < bestParticipants.length; i += 2) {
                    tournament.brackets[bracketIndex].participants = [];
                    tournament.brackets[bracketIndex].participants.push({
                        id: `${this.generateUniqueId()}`,
                        resultText: '0',
                        isWinner: false,
                        status: 'PLAYED',
                        name: bestParticipants[i],
                    });

                    tournament.brackets[bracketIndex].participants.push({
                        id: `${this.generateUniqueId()}`,
                        resultText: '0',
                        isWinner: false,
                        status: 'PLAYED',
                        name: bestParticipants[i + 1],
                    });

                    bracketIndex--;
                }

                const update = { $set: { isGroupPhaseDone: true, brackets: tournament.brackets } };
                const result = await this.db.collection("tournaments").updateOne(filter, update);

                return result;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    async returnTournamentToGroupPhase(id) {
        if (ObjectId.isValid(id)) {
            const objectId = new ObjectId(id);
            const filter = { _id: objectId };
            const tournament = await this.db.collection("tournaments").findOne(filter);

            if (tournament && tournament.isGroupPhaseDone) {
                for (let i = 0; i < tournament.brackets.length; i++) {
                    tournament.brackets[i].participants = [];
                    tournament.brackets[i].state = "SCHEDULED";
                }

                const update = { $set: { isGroupPhaseDone: false, brackets: tournament.brackets } };
                const result = await this.db.collection("tournaments").updateOne(filter, update);

                return result;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    async addPointsToGroupMember(id, groupIndex, memberIndex, points) {
        const objectId = new ObjectId(id);
        const filter = { _id: objectId };
        const tournament = await this.db.collection("tournaments").findOne(filter);

        if (tournament) {
            tournament.groups[groupIndex].results[memberIndex] += points;
            const update = { $set: { groups: tournament.groups } };
            const result = await this.db.collection("tournaments").updateOne(filter, update);
            return result;
        } else {
            return null;
        }
    }

    generateUniqueId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    sortByResults(group) {
        const combined = group.participants.map((participant, index) => ({
            participant,
            result: group.results[index]
        }));

        combined.sort((a, b) => b.result - a.result);

        group.participants = combined.map(item => item.participant);
        group.results = combined.map(item => item.result);

        return group;
    }

    async updateTournament(tournament) {
        const objectId = new ObjectId(tournament._id);
        const filter = { _id: objectId };
        const update = { $set: tournament };

        const result = await this.db.collection("tournaments").updateOne(filter, update);
        return result;
    }
}