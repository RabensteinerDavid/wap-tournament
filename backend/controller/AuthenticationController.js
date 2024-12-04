import { DbConnectionService } from '../service/DbConnectionService.js';
import registerValidationSchema from '../model/validation/RegisterValidationSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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

    async verifyUser(req, res) {
        try {
            const user = await this.dbCommunicatorService.findUserByVerificationToken(req.body.verificationToken);
            if (user) {
                // update token
                if (user.verificationToken.expiresAt > Date.now()) {
                    user.verificationToken.isValid = false;
                    user.isActive = true;
                    const result = await this.dbCommunicatorService.updateUser(user);
                    return res.send(result);
                } else {
                    res.status(400).json({ error: 'Verification token expired ' });
                }
            } else {
                return res.status(404).json({ error: 'User not found' })
            }
        } catch (e) {
            res.status(500).json({ error: 'Internal server error' });
        }
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

            const verificationToken = {
                isValid: true, // will be set to false, when used
                expiresAt: Date.now() + 24 * 60 * 60 * 1000, // tomorrow
                token: crypto.randomBytes(32).toString("hex")
            }

            // Create a new user
            const user = {
                username: req.body.username,
                email: req.body.email.toLowerCase(),
                password: hashedPassword,
                isActive: false,
                verificationToken: verificationToken
            };

            // TODO: send email with verification link (not mandatory for this exercise)
            
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

            if (!user.isActive) {
                return res.status(403).json({ error: 'User account is not active' });
            }

            // Generate Access Token
            const token = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Generate Refresh Token
            const refreshToken = jwt.sign(
                { email: user.email },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            await this.dbCommunicatorService.storeRefreshToken(user.email, refreshToken);

            res.status(200).json({ token, refreshToken });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async refreshAccessToken(req, res) {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }

        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            // Check if saved in database -> can also be revoked from admin
            const isValid = await this.dbCommunicatorService.verifyRefreshToken(decoded.email, refreshToken);
            if (!isValid) {
                return res.status(403).json({ error: 'Invalid refresh token' });
            }

            // create new access token
            const newAccessToken = jwt.sign(
                { email: decoded.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ accessToken: newAccessToken });
        } catch (err) {
            res.status(403).json({ error: 'Invalid or expired refresh token' });
        }
    }

    async getUser(req, res) {
        try {
            // Fetch user details using the decoded token
            const user = await this.dbCommunicatorService.findUserByEmail(req.user.email); // from the token middleware
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ username: user.username, email: user.email, id: user._id });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}