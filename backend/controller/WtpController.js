import { Bracket } from "../model/Bracket.js";
import { Group } from "../model/Group.js";
import { Tournament } from "../model/Tournament.js";
import createTournamentSchema from "../model/validation/CreateTournamentSchema.js";
import { DbConnectionService } from "../service/DbConnectionService.js";

export class WtpController {
    static instance;
    dbCommunicatorService;

    static async getInstance() {
        if (this.instance == undefined) {
            this.instance = new WtpController();
            this.instance.dbCommunicatorService = await DbConnectionService.getInstance();
        }

        return this.instance;
    }

    test(req, res) {
        res.send("Server test");
    }

    async createTournament(req, res) {
        try {
            // validate the request data
            const { error } = createTournamentSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            // collect the request data
            const date = new Date(req.body.date);
            const participants = req.body.participants;
            const shuffledParticipants = participants.sort(() => Math.random() - 0.5);
            const title = req.body.title;

            // create empty brackets for ko phase
            let brackets = [];
            const finale = new Bracket(null);
            brackets.push(finale);
            // determine how many brackets to generate
            const participantsLength = participants.length;
            const isPowerOfTwo = (participantsLength & (participantsLength - 1)) === 0 && participantsLength > 0;
            const numRounds = isPowerOfTwo ? Math.log2(participantsLength) : Math.log2(participantsLength) - 1;
            this.generateBrackets(finale, 0, numRounds, brackets, date);

            // create groups for group phase
            const exponent = Math.floor(Math.log2(participants.length));
            const amountBrackets = Math.pow(2, exponent) / 4;
            const groups = this.distributeIntoGroups(shuffledParticipants, amountBrackets);

            // create tournament object
            const user = await this.dbCommunicatorService.findUserByEmail(req.user.email);
            let tournament = new Tournament(title, groups, brackets, date, participants, user._id);
            
            // store tournament and return tournament with generated id
            const insertInfo = await this.dbCommunicatorService.storeTournament(tournament);
            res.send(tournament);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    distributeIntoGroups(participants, numGroups) {
        // initialize empty groups
        let groups = [];
        for (let i = 0; i < numGroups; i++) {
            groups[i] = [];
        }

        // fill the groups evenly
        let index = 0;
        for (const participant of participants) {
            if (index === numGroups) {
                index = 0;
            }
            groups[index].push(participant);
            index++;
        }

        // update the groups structure to real group objects
        for (let i = 0; i < numGroups; i++) {
            groups[i] = new Group(groups[i]);
        }

        return groups;
    }

    generateBrackets(bracket, amount, numRounds, brackets, date) {
        if (amount < numRounds - 1) {
            let bracketOne = new Bracket(bracket.id, date);
            let bracketTwo = new Bracket(bracket.id, date);

            brackets.push(bracketOne);
            brackets.push(bracketTwo);

            amount++;

            this.generateBrackets(bracketOne, amount, numRounds, brackets, date);
            this.generateBrackets(bracketTwo, amount, numRounds, brackets, date);   
        }
    }

    async getTournaments(req, res) {
        try {
            const tournaments = await this.dbCommunicatorService.getTournaments();
            res.send(tournaments);
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Internal server error' });
        }
    }

     async getTournament(req, res) {
        try {
            const tournament = await this.dbCommunicatorService.getTournament(req.params.id);
            if (tournament) {
                res.send(tournament);
            } else {
                return res.status(404).json({ error: "Tournament not found" });
            }
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Internal server error' });
        }
     }
    
    async deleteTournament(req, res) {
        try {
            const user = await this.dbCommunicatorService.findUserByEmail(req.user.email); // from the token middleware
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const tournament = await this.dbCommunicatorService.getTournament(req.params.id);
            
            if (tournament) {
                if (tournament.userId.equals(user._id)) {
                    const result = await this.dbCommunicatorService.deleteTournament(req.params.id);
                    res.send(result);
                } else {
                    return res.status(403).json({ error: "Forbidden" });
                }
            } else {
                return res.status(404).json({ error: "Tournament not found" });
            }
        } catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}