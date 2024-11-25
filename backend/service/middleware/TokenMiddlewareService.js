import jwt from 'jsonwebtoken';
import { DbConnectionService } from '../DbConnectionService.js';

export class TokenMiddlewareService {
    static instance;

    async verifyToken(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            // verify the access token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // get user from db
            const dbCommunicatorService = await DbConnectionService.getInstance();
            const user = await dbCommunicatorService.findUserByEmail(decoded.email);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // check if user is active
            if (!user.isActive) {
                return res.status(403).json({ error: 'User account is not active' });
            }

            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }

    static getInstance() {
        if (this.instance == undefined) {
            this.instance = new TokenMiddlewareService();
        }

        return this.instance;
    }
}