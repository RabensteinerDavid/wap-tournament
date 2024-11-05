export class WtpController {
    static instance;

    test(req, res) {
        res.send("Server test");
    }

    static getInstance() {
        if (this.instance == undefined) {
            this.instance = new WtpController();
        }

        return this.instance;
    }
}