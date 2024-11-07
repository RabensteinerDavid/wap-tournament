import Joi from 'joi';

const createTournamentSchema = Joi.object({
    date: Joi.date().required(),
    participants: Joi.array().items(Joi.string()).min(8).required(),
    title: Joi.string().min(3).max(100).required()
});

export default createTournamentSchema;