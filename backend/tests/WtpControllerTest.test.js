import { WtpController } from '../controller/WtpController.js';
import { expect, jest } from '@jest/globals';
import { ObjectId } from "mongodb";

// Mocking the dbCommunicatorService
const mockDbCommunicatorService = {
  findUserByEmail: jest.fn(),
  storeTournament: jest.fn()
};

// Mocking the validation schema
const createTournamentValidationSchema = {
  validate: jest.fn(),
};

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('WtpController.createTournament', () => {
    let req;
    let res;
    let controller;

    beforeEach(() => {
        req = { body: {} };
        res = mockResponse();
        jest.clearAllMocks();
        controller = new WtpController();
        controller.dbCommunicatorService = mockDbCommunicatorService;
    });

    test('should return 400 if date is missing', async () => {
        await controller.createTournament(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "\"date\" is required" });
    });

    test('should return 400 if participants are missing', async () => {
        req.body.date = new Date();

        await controller.createTournament(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "\"participants\" is required" });
    });

    test('should return 400 if participants are not an String array', async () => {
        req.body.date = new Date();
        req.body.participants = [1, 2, 3, 4, 5];
        
        await controller.createTournament(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "\"participants[0]\" must be a string" });
    });

    test('should return 400 if participants array lenth < 8', async () => {
        req.body.date = new Date();
        req.body.participants = ["Dominik", "Florian", "Anna"];

        await controller.createTournament(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "\"participants\" must contain at least 8 items" });
    });

    test('should return 400 if title is missing', async () => {
        req.body.date = new Date();
        req.body.participants = ["Dominik", "Florian", "Anna", "Glemens", "Goblin", "Oger", "Teamname", "Ogername"];

        await controller.createTournament(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "\"title\" is required" });
    });

    test('should return 201 if it was created successfully', async () => {
        mockDbCommunicatorService.findUserByEmail.mockResolvedValue(
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
        mockDbCommunicatorService.storeTournament.mockResolvedValue(null); // not of importance for the unit test

        req.user = { email: 'test@example.com' };
        req.body.date = new Date();
        req.body.participants = ["Dominik", "Florian", "Anna", "Glemens", "Goblin", "Oger", "Teamname", "Ogername"];
        req.body.title = "Title of tournament";

        await controller.createTournament(req, res);

        expect(mockDbCommunicatorService.findUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                brackets: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        nextMatchId: expect.anything(), // can also be null
                        participants: [],
                        startTime: expect.any(Date),
                        state: "SCHEDULED",
                    }),
                ]),
                date: expect.any(Date),
                groups: expect.any(Array),
                isGroupPhaseDone: false,
                participants: expect.any(Array),
                title: "Title of tournament",
                userId: expect.any(ObjectId),
                winner: null,
            })
        );
        expect(res.json.mock.calls[0][0].brackets).toHaveLength(3);
        expect(res.json.mock.calls[0][0].participants).toHaveLength(8);    
    });

    test('should return 500 Internal Server Error if an exception occurs', async () => {
        mockDbCommunicatorService.findUserByEmail.mockRejectedValue(new Error('Database error'));

        req.user = { email: 'test@example.com' };
        req.body.date = new Date();
        req.body.participants = ["Dominik", "Florian", "Anna", "Glemens", "Goblin", "Oger", "Teamname", "Ogername"];
        req.body.title = "Title of tournament";

        await controller.createTournament(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
