export class Group {
    participants; // array of team strings
    results; // array of results -> same order as participants

    constructor(participants) {
        this.participants = participants;
        this.results = new Array(participants.length).fill(0);
    }
}