import jwt from 'jsonwebtoken';

export class TokenMiddlewareService {
    static instance;

    verifyToken(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
            }
            req.user = decoded;
            next();
        });
    }

    static getInstance() {
        if (this.instance == undefined) {
            this.instance = new TokenMiddlewareService();
        }

        return this.instance;
    }
}