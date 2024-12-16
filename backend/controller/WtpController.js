import { Bracket } from "../model/Bracket.js";
import { Group } from "../model/Group.js";
import { Tournament } from "../model/Tournament.js";
import { addPointsSchema, addPointsSchemaParams } from "../model/validation/AddPointsSchema.js";
import createTournamentSchema from "../model/validation/CreateTournamentSchema.js";
import setWinnerSchema from "../model/validation/SetWinnerSchema.js";
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

            let brackets = [];
            this.generateEmptyBrackets(brackets, date, participants);

            // create groups for group phase
            const exponent = Math.floor(Math.log2(participants.length));
            const amountBrackets = Math.pow(2, exponent) / 4;
            const groups = this.distributeIntoGroups(shuffledParticipants, amountBrackets);

            // create tournament object
            const user = await this.dbCommunicatorService.findUserByEmail(req.user.email);
            let tournament = new Tournament(title, groups, brackets, date, participants, user._id);
            
            // store tournament and return tournament with generated id
            const insertInfo = await this.dbCommunicatorService.storeTournament(tournament);
            res.status(201).json(tournament);
        } catch (e) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateTournament(req, res) {
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

            let brackets = [];
            this.generateEmptyBrackets(brackets, date, participants);

            // create groups for group phase
            const exponent = Math.floor(Math.log2(participants.length));
            const amountBrackets = Math.pow(2, exponent) / 4;
            const groups = this.distributeIntoGroups(shuffledParticipants, amountBrackets);

            let tournament = await this.dbCommunicatorService.getTournament(req.params.id);

            tournament.title = title;
            tournament.groups = groups;
            tournament.brackets = brackets;
            tournament.isGroupPhaseDone = false;
            tournament.date = date;
            tournament.participants = participants;

            if (tournament) {
                this.dbCommunicatorService.updateTournament(tournament);
                return res.send(tournament);
            } else {
                return res.status(404).json("Tournament not found");
            }
        } catch (e) {
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

    generateEmptyBrackets(brackets, date, participants) {
        // create empty brackets for ko phase
        const finale = new Bracket(null, date);
        brackets.push(finale);
        // determine how many brackets to generate
        const participantsLength = participants.length;
        const isPowerOfTwo = (participantsLength & (participantsLength - 1)) === 0 && participantsLength > 0;
        let numRounds = isPowerOfTwo ? Math.log2(participantsLength) : Math.log2(participantsLength) - 1;
        numRounds--;
        this.generateBracketsRecursive(finale, 0, numRounds, brackets, date);
    }

    generateBracketsRecursive(bracket, amount, numRounds, brackets, date) {
        if (amount < numRounds - 1) {
            let bracketOne = new Bracket(bracket.id, date);
            let bracketTwo = new Bracket(bracket.id, date);

            brackets.push(bracketOne);
            brackets.push(bracketTwo);

            amount++;

            this.generateBracketsRecursive(bracketOne, amount, numRounds, brackets, date);
            this.generateBracketsRecursive(bracketTwo, amount, numRounds, brackets, date);   
        }
    }

    async getTournaments(req, res) {
        try {
            const tournaments = await this.dbCommunicatorService.getTournaments();
            res.send(tournaments);
        } catch (e) {
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
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async finishGroupPhase(req, res) {
        try {
            const user = await this.dbCommunicatorService.findUserByEmail(req.user.email); // from the token middleware
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const tournament = await this.dbCommunicatorService.getTournament(req.params.id);
            
            if (tournament) {
                if (tournament.userId.equals(user._id)) {
                    if (tournament.isGroupPhaseDone) {
                        return res.status(400).json({ error: "Group phase already finished" });
                    }

                    const result = await this.dbCommunicatorService.finishGroupPhaseOfTournament(req.params.id);
                    res.send(result);
                } else {
                    return res.status(403).json({ error: "Forbidden" });
                }
            } else {
                return res.status(404).json({ error: "Tournament not found" });
            }
        } catch (e) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async returnToGroupPhase(req, res) {
        try {
            const user = await this.dbCommunicatorService.findUserByEmail(req.user.email); // from the token middleware
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const tournament = await this.dbCommunicatorService.getTournament(req.params.id);
            
            if (tournament) {
                if (tournament.userId.equals(user._id)) {
                    if (!tournament.isGroupPhaseDone) {
                        return res.status(400).json({ error: "Tournament already in group phase" });
                    }

                    const result = await this.dbCommunicatorService.returnTournamentToGroupPhase(req.params.id);
                    res.send(result);
                } else {
                    return res.status(403).json({ error: "Forbidden" });
                }
            } else {
                return res.status(404).json({ error: "Tournament not found" });
            }
        } catch (e) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async addPointsToGroupMember(req, res) {        
        { // new scope to destructure the result
            const { error } = addPointsSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
        }

        const { errorParams } = addPointsSchemaParams.validate(req.body);
        if (errorParams) {
            return res.status(400).json({ error: errorParams.details[0].message });
        }
        
        try {
            const user = await this.dbCommunicatorService.findUserByEmail(req.user.email); // from the token middleware
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const tournament = await this.dbCommunicatorService.getTournament(req.params.id);
            
            if (tournament) {
                if (tournament.userId.equals(user._id)) {
                    if (tournament.isGroupPhaseDone) {
                        return res.status(400).json({ error: "Tournament already in ko phase" });
                    }

                    const id = req.params.id;
                    const groupIndex = req.params.groupIndex;
                    const memberIndex = req.params.memberIndex;
                    const points = req.body.points;

                    const result = await this.dbCommunicatorService.addPointsToGroupMember(id, groupIndex, memberIndex, points);
                    res.send(result);
                } else {
                    return res.status(403).json({ error: "Forbidden" });
                }
            } else {
                return res.status(404).json({ error: "Tournament not found" });
            }
        } catch (e) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async setWinnerOfBracket(req, res) {
        try {
            const user = await this.dbCommunicatorService.findUserByEmail(req.user.email); // from the token middleware
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const { error } = setWinnerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const pointsLoser = req.body.pointsLoser;
            const pointsWinner = req.body.pointsWinner;

            if (pointsLoser >= pointsWinner) {
                return res.status(400).json({ error: "Loser can't have same or more points than winner" });
            }

            let tournament = await this.dbCommunicatorService.getTournament(req.params.id);
            
            if (tournament) {
                if (tournament.userId.equals(user._id)) {
                    if (!tournament.isGroupPhaseDone) {
                        return res.status(400).json({ error: "Tournament still in group phase" });
                    }

                    // search for bracket
                    let bracket = this.getBracket(tournament, req.params.bracketId);
                    let ascendingBracket = this.getAscendingBracket(tournament, bracket);

                    if (!bracket) {
                        return res.status(404).json({ error: "Bracket not found" });
                    }

                    // check if one participant is TBD
                    if (this.getIfTBD(bracket)) {
                        return res.status(400).json({ error: "Bracket not ready for match" });
                    }

                    // get participant
                    let { participant, participantsIndex } = this.getParticipant(bracket, req.params.participantId);
                    if (!participant) {
                        return res.status(404).json({ error: "Participant not found" });
                    }

                    if (!ascendingBracket) {
                        this.setWinner(bracket, participantsIndex, pointsWinner, pointsLoser);
                        tournament.winner = participant.name;
                    } else {
                        // check if one participant already won
                        let isAlreadyWon = false;
                        for (let i = 0; i < ascendingBracket.participants.length; i++) {
                            for (let j = 0; j < bracket.participants.length; j++) {
                                if (ascendingBracket.participants[i].name == bracket.participants[j].name) {
                                    // already a winner of bracket -> return bad request
                                    isAlreadyWon = true;
                                    return res.status(400).json({ error: "Bracket already has a winner" });
                                }
                            }
                        }

                        if (!isAlreadyWon) {
                            this.setWinner(bracket, participantsIndex, pointsWinner, pointsLoser);
                            ascendingBracket.participants.push({
                                id: participant.id,
                                isWinner: false,
                                resultText: "0",
                                status: participant.status,
                                name: participant.name
                            });
                        }
                    }

                    tournament = await this.dbCommunicatorService.updateTournament(tournament);
                    res.send(tournament);
                } else {
                    return res.status(403).json({ error: "Forbidden" });
                }
            } else {
                return res.status(404).json({ error: "Tournament not found" });
            }
        } catch (e) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * 
     * This operation resets a bracket -> no winners, no points in bracket
     * if the ascending bracket already has a winner, the operation
     * will check if this winner is not also located in the ascending
     * bracket of the ascending bracket. If so, the operation should
     * fail. If not, or the ascending of the ascending bracket is the
     * finale, the winner participant will be removed from the ascending
     * bracket and the bracket winner will be reset -> also the resultTexts
     * 
     * @param {*} req request params: tournamentId (id), bracketId, participantId
     * @param {*} res tournament
     * @returns 
     */
    async resetWinnersInBracket(req, res) {

        try {
            const user = await this.dbCommunicatorService.findUserByEmail(req.user.email); // from the token middleware
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            let tournament = await this.dbCommunicatorService.getTournament(req.params.id);

            if (tournament) {
                if (tournament.userId.equals(user._id)) {
                    if (!tournament.isGroupPhaseDone) {
                        return res.status(400).json({ error: "Tournament still in group phase" });
                    }

                    // search for bracket
                    let bracket = this.getBracket(tournament, req.params.bracketId);
                    let ascendingBracket = this.getAscendingBracket(tournament, bracket);
                    
                    if (!bracket) {
                        return res.status(404).json({ error: "Bracket not found" });
                    }

                    // check if one participant is TBD
                    if (this.getIfTBD(bracket)) {
                        return res.status(400).json({ error: "Bracket not ready for match" })
                    }

                    if (!ascendingBracket) {
                        // finale
                        bracket = this.resetWinner(bracket);
                    } else {
                        // no finale
                        let isAlreadyInAscendingBracket = false;
                        bracket.participants.forEach(participant => {
                            ascendingBracket.participants.forEach(ascendingParticipant => {
                                if (participant.id == ascendingParticipant.id) {
                                    isAlreadyInAscendingBracket = true;
                                }
                            });
                        });

                        // special case: we can remove the participant from ascending when
                        // ascending of ascending does not exist OR ascending of ascending does not contain the winner    
                        if (isAlreadyInAscendingBracket) {
                            // TODO get winner
                            let winner = null;
                            bracket.participants.forEach((participant) => {
                                if (participant.isWinner) {
                                    winner = participant;
                                }
                            });

                            let ascAscendingBracket = this.getAscendingBracket(tournament, ascendingBracket);
                            
                            if (ascAscendingBracket) {
                                // check  if winner is in asc ascending bracket
                                let isAlreadyinAscAscendingBracket = false;
                                ascAscendingBracket.participants.forEach((participant) => {
                                    if (participant.id === winner.id) {
                                        isAlreadyinAscAscendingBracket = true;
                                    }
                                });

                                if (isAlreadyinAscAscendingBracket) {
                                    return res.status(400).json({ error: "The winner is already in the ascending bracket of the ascending bracket. Unable to reset!" })
                                } else {
                                    ascendingBracket = this.removeFromAscending(ascendingBracket, winner);
                                    bracket = this.resetWinner(bracket);
                                }
                            } else {
                                // ascending bracket has no ascending bracket
                                // remove winner participant from ascending and reset winner of bracket
                                
                                ascendingBracket = this.removeFromAscending(ascendingBracket, winner);
                                bracket = this.resetWinner(bracket);
                            }
                        }

                        bracket = this.resetWinner(bracket);
                    }
                    
                    tournament = await this.dbCommunicatorService.updateTournament(tournament);
                    return res.send(tournament);
                } else {
                    return res.status(403).json({ error: "Forbidden" });
                }
            } else {
                return res.status(404).json({ error: "Tournament not found" });
            }
        } catch (e) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    removeFromAscending(ascendingBracket, winner) {
        for (let i = 0; i < ascendingBracket.participants.length; i++) {
            if (ascendingBracket.participants[i].id == winner.id) {
                ascendingBracket.participants.splice(i, 1);
            }
        }

        return ascendingBracket;
    }

    setWinner(bracket, participantIndex, pointsWinner, pointsLoser) {
        bracket.participants[participantIndex == 0 ? 0 : 1].isWinner = false;
        bracket.participants[participantIndex == 0 ? 0 : 1].resultText = pointsLoser.toString();
        bracket.participants[participantIndex == 0 ? 1 : 0].isWinner = true;
        bracket.participants[participantIndex == 0 ? 1 : 0].resultText = pointsWinner.toString();
        
        return bracket;
    }

    resetWinner(bracket) {
        bracket.participants[0].isWinner = false;
        bracket.participants[1].isWinner = false;
        bracket.participants[0].resultText = "0";
        bracket.participants[1].resultText = "0";
        
        return bracket;
    }

    getBracket(tournament, bracketId) {
        for (let i = 0; i < tournament.brackets.length; i++) {
            if (tournament.brackets[i].id == bracketId) {
                return tournament.brackets[i];
            }
        }
    }

    getAscendingBracket(tournament, bracket) {
        for (let i = 0; i < tournament.brackets.length; i++) {
            if (tournament.brackets[i].id == bracket.nextMatchId) {
                return tournament.brackets[i];
            }
        }
    }

    getIfTBD(bracket) {
        for (let i = 0; i < bracket.participants.length; i++) {
            if (bracket.participants[i].name == "TBD") {
                return true;
            }
        }

        if (bracket.participants.length < 2) {
            return true;
        }

        return false;
    }

    getParticipant(bracket, participantId) {
        for (let i = 0; i < bracket.participants.length; i++) {
            if (bracket.participants[i].id == participantId) {
                const participant = bracket.participants[i];
                return {participant, i}
            }
        }
    }
}