const joi = require('joi');
exports.signupVailidator = joi.object({
    fullName: joi.string().required(),
    password: joi.string().required(),
    email: joi.string().email().required(),
});

exports.loginVailidator = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

exports.profileVailidator = joi.object({
    fullName: joi.string().optional()
});

exports.forgetPasswordVailidator = joi.object({
    email: joi.string().email().required()
});

exports.verifyTokenVailidator = joi.object({
    token:joi.string().required(),
});

exports.updatePasswordVailidator = joi.object({
    email:joi.string().required(),
    newPassword: joi.string().min(6).max(16).required().label('newPassword'),
    confirmPassword: joi.any().equal(joi.ref('newPassword')).required().label('Confirm password').options({ messages: { 'any.only': '{{#label}} does not match'} })
});
