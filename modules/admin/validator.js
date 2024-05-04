const joi = require('joi');

exports.loginValidator = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

