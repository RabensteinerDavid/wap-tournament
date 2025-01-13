export class Bracket {
    id;
    nextMatchId;
    startTime;
    state;
    participants;

    constructor(nextMatchId, date) {
        this.id = this.generateUniqueId(),
        this.nextMatchId = nextMatchId,
        this.startTime = date,
        this.state = 'SCHEDULED',
        this.participants = []
    }

    generateUniqueId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }
}