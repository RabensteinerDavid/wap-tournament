export class Tournament {
    title;
    groups; // group phase
    brackets; // ko phase
    isGroupPhaseDone;
    date;
    participants;
    winner;
    userId;

    constructor(title, groups, brackets, date, participants, userId) {
        this.winner = null;
        this.isGroupPhaseDone = false;
        this.title = title;
        this.groups = groups;
        this.brackets = brackets;
        this.date = date;
        this.participants = participants;
        this.userId = userId;
    }

    setToKoPhase() {
        this.isGroupPhaseDone = true;
    }

    setWinner(winner) {
        this.winner = winner;
    }
}