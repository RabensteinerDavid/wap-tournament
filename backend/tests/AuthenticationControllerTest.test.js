import { AuthenticationController } from '../controller/AuthenticationController.js';
import { jest } from '@jest/globals';
import { ObjectId } from "mongodb";

// Mocking the dbCommunicatorService
const mockDbCommunicatorService = {
  findUserByEmail: jest.fn(),
  findUserByUsername: jest.fn(),
  storeUser: jest.fn(),
};

// Mocking the validation schema
const registerValidationSchema = {
  validate: jest.fn(),
};

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthenticationController.register', () => {
    let req;
    let res;
    let controller;

    beforeEach(() => {
        req = { body: {} };
        res = mockResponse();
        jest.clearAllMocks();
        controller = new AuthenticationController();
        controller.dbCommunicatorService = mockDbCommunicatorService;
    });

    test('should return 400 if username is missing', async () => {
        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "\"username\" is required" });
    });

    test('should return 400 if email is missing', async () => {
        req.body.username = "Dominik";
        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "\"email\" is required" });
    });

    test('should return 400 if password is missing', async () => {
        req.body.username = "Dominik";
        req.body.email = "test@example.com";
        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "\"password\" is required" });
    });

    test('should return 400 if email already exists', async () => {
        registerValidationSchema.validate.mockReturnValue({ error: null });
        mockDbCommunicatorService.findUserByEmail.mockResolvedValue( // found one -> email is taken
            {
                _id: new ObjectId('67507aacaf77623912c855b4'),
                username: 'Dominik',
                email: 'test@example.com',
                password: '$2a$10$RI23cxaJOOe0MzOO0N1DzuNg5eJ81UyB.khHjtb86ittDS29PJLK2',
                isActive: true,
                verificationToken: {
                    isValid: false,
                    expiresAt: 1733413932802,
                    token: 'e6df9464e5776ccbc1cc97990677057eb4175ab11bf689ffb127e8337dc235c3'
                }
            }
        );

        req.body.email = 'test@example.com';
        req.body.username = 'testuser';
        req.body.password = '123Spiegelei';

        await controller.register(req, res);

        expect(mockDbCommunicatorService.findUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });

    test('should return 400 if username already exists', async () => {
        registerValidationSchema.validate.mockReturnValue({ error: null });
        mockDbCommunicatorService.findUserByEmail.mockResolvedValue(null); // did not find any -> email is not used
        mockDbCommunicatorService.findUserByUsername.mockResolvedValue( // found one -> username is taken
            {
                _id: new ObjectId('67507aacaf77623912c855b4'),
                username: 'Dominik',
                email: 'bananenland@example.com',
                password: '$2a$10$RI23cxaJOOe0MzOO0N1DzuNg5eJ81UyB.khHjtb86ittDS29PJLK2',
                isActive: true,
                verificationToken: {
                    isValid: false,
                    expiresAt: 1733413932802,
                    token: 'e6df9464e5776ccbc1cc97990677057eb4175ab11bf689ffb127e8337dc235c3'
                }
            }
        );

        req.body.email = 'test@example.com';
        req.body.username = 'Dominik';
        req.body.password = '123Spiegelei';

        await controller.register(req, res);

        expect(mockDbCommunicatorService.findUserByUsername).toHaveBeenCalledWith('Dominik');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
    });

    test('should return 201 if user was created successfully', async () => {
        registerValidationSchema.validate.mockReturnValue({ error: null });
        mockDbCommunicatorService.findUserByEmail.mockResolvedValue(null);
        mockDbCommunicatorService.findUserByUsername.mockResolvedValue(null);
        mockDbCommunicatorService.storeUser.mockResolvedValue(null); // will be ignored in the controller anyway

        req.body.username = 'Dominik';
        req.body.email = 'test@example.com';
        req.body.password = '123Spiegelei';

        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    test('should return 500 Internal Server Error if an exception occurs', async () => {
        registerValidationSchema.validate.mockReturnValue({ error: null });
        mockDbCommunicatorService.findUserByEmail.mockRejectedValue(new Error('Database error'));

        req.body.username = 'Dominik';
        req.body.email = 'test@example.com';
        req.body.password = '123Spiegelei';

        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
