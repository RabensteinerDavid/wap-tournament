import { DbConnectionService } from '../service/DbConnectionService.js';
import registerValidationSchema from '../model/validation/RegisterValidationSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createTournamentSchema from '../model/validation/CreateTournamentSchema.js';

export class AuthenticationController {
    static instance;
    dbCommunicatorService;

    static async getInstance() {
        if (this.instance == undefined) {
            this.instance = new AuthenticationController();
            this.instance.dbCommunicatorService = await DbConnectionService.getInstance();
        }

        return this.instance;
    }

    async register(req, res) {
        try {
            const { error } = registerValidationSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            // Check if the email already exists
            let existingUser = await this.dbCommunicatorService.findUserByEmail(req.body.email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            // Check if the username already exists
            existingUser = await this.dbCommunicatorService.findUserByUsername(req.body.username);
            if (existingUser) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Create a new user
            const user = {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            };
            
            this.dbCommunicatorService.storeUser(user);

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
            // Check if the email exists
            const user = await this.dbCommunicatorService.findUserByEmail(req.body.email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compare passwords
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '6h' });
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getUser(req, res) {
        try {
            // Fetch user details using the decoded token
            const user = await this.dbCommunicatorService.findUserByEmail(req.user.email); // from the token middleware
            if (!user) {
            return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ username: user.username, email: user.email });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}