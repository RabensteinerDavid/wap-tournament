import Joi from 'joi';

export const addPointsSchema = Joi.object({
    points: Joi.number().required(),
});

export const addPointsSchemaParams = Joi.object({
    id: Joi.number().required(),
    groupIndex: Joi.number().required(),
    memberIndex: Joi.number().required(),
});