import * as Joi from 'joi';

export const joiUserSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password : Joi.string().min(8).max(20).required(),
    firstname : Joi.string().min(3).max(50).required(),
    lastname : Joi.string().min(3).max(50).required(),
})