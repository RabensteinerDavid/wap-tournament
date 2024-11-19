import Joi from 'joi';

const setWinnerSchema = Joi.object({
    pointsWinner: Joi.number().required(),
    pointsLoser: Joi.number().required()
});

export default setWinnerSchema;