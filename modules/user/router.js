const middleware = require('../../middleware/validation');
const hasRole = require('../../middleware/has_role');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;
const { signupVailidator, loginVailidator, profileVailidator, forgetPasswordVailidator,verifyTokenVailidator,updatePasswordVailidator } = require("./validator")
const { userSignup, userLogin, userDetail, userProfileUpdate, userForgetPassword,verifyToken,updatePassword } = require("./controller")

module.exports = (app) => {
    app.post('/user/signup', middleware(signupVailidator), userSignup);
    app.post('/user/login', middleware(loginVailidator), userLogin);
    app.get('/user/detail', authCheck, userDetail);
    app.put('/user/profile/update', authCheck, middleware(profileVailidator),hasRole([2]) ,userProfileUpdate);
    app.post('/user/forget/password', middleware(forgetPasswordVailidator), userForgetPassword);
    app.get('/user/verify/token', middleware(verifyTokenVailidator), verifyToken);
    app.post('/user/update/password', middleware(updatePasswordVailidator), updatePassword);
}