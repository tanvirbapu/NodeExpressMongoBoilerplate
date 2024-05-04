const { hashPasswordUsingBcrypt } = require('../../utils/auth');
const bcrypt = require('bcrypt');
const message = require('../../config/message');
const response = require('../../utils/response');
const auth = require('../../utils/auth');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { createUser, checkUserExist, getUserDetail, updateUserProfile, findUser, updatePassword, showAllUser, removeUser, getEmail } = require('./db_query');

/**
* @author - Tanvir Shaikh
* @userSignup - function to create user
* @param {*} req 
* @param {*} res 
* @returns 
*/

exports.userSignup = async (req, res) => {
    try {
        console.log(req.body);
        const userData = req.body;
        const userExist = await checkUserExist({ email: userData.email });
        if (userExist) return res.json(response.success(405, message.user.USER_EXIST));
        const pass = await hashPasswordUsingBcrypt(req.body.password);
        userData.password = pass;
        if (!userExist) {
            const createUserRes = await createUser(userData);
            return res.json(response.success(201, message.user.USER_ADD));
        }
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.CATCH_ERROR, error));
    }
};

/**
* @author - Tanvir Shaikh
* @userLogin - function to user Login
* @param {*} req 
* @param {*} res 
* @returns 
*/
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await checkUserExist({ email: email });

        if (!userData) return res.json(response.success(200, message.user.USER_NOT_EXIST));
        if (userData.isDelete == true) return res.json(response.success(200, message.user.ACTIVE_USER));
        const result = await bcrypt.compare(password, userData.password);
        if (!result) return res.json(response.failure(204, message.user.WRONG_USERnAME_PASSWORD));
        const token = auth.generateToken({ userId: userData._id });
        userData.authToken = token;
        return res.json(response.success(200, message.user.USER_LOGIN_SUCCESS, { token: token }));
    } catch (error) {
        return res.json(response.failure(204, message.CATCH_ERROR, error));
    }
};

/**
* @author - Tanvir Shaikh
* @userDetail - function to  get All User
* @param {*} req 
* @param {*} res 
* @returns 
*/
exports.userDetail = async function (req, res) {
    try {
        const userData = await getUserDetail({ _id: req.user._id });
        if (userData) return res.json(response.success(200, message.user.READ, { userData: userData }));
        else return res.json(response.failure(204, message.user.READ_ERROR));
    }
    catch (error) {
        return res.json(response.failure(204, message.user.CATCH_ERROR, error));
    }
}

/**
* @userProfileUpdate - function to update User Profile
* @param {*} req 
* @param {*} res 
* @returns 
*/
exports.userProfileUpdate = async function (req, res) {
    try {
        const userData = await updateUserProfile(req);
        if (userData) return res.json(response.success(200, message.user.UPDATE, { userData: userData }));
        else return res.json(response.failure(204, message.user.FAILURE_UPDATE));
    }
    catch (error) {
        return res.json(response.failure(204, message.user.CATCH_ERROR, error));
    }
}
/**
* @userForgetPassword - function to forget password
* @param {*} req 
* @param {*} res 
* @returns 
*/
exports.userForgetPassword = async function (req, res) {
    try {
        const { email } = req.body;
        const user = await findUser({ email });
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Please click the following link to reset your password:</p><a href="http://localhost:50111/user/reset/password?token=${resetToken}">Reset Password</a>`,
        };
        await transporter.sendMail(mailOptions);
        return res.json(response.success(200, message.user.FORGET_PASSWORD_SENT_MAIL));
    } catch (error) {
        return res.json(response.failure(204, message.user.CATCH_ERROR, error));

    }
}

/**
* @author - Tanvir Shaikh
* @verifyToken - function to verify token
* @param {*} req 
* @param {*} res 
* @returns 
*/
exports.verifyToken = async function (req, res) {
    try {
        const { token } = req.query;
        const user = await findUser({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.json(response.failure(400, message.user.FAILURE_RESET_PASSWORD))
        }
        return res.json(response.success(200, message.user.RESET_PASSWORD))
    } catch (error) {
        return res.json(response.failure(204, message.user.CATCH_ERROR, error));
    }
}

/**
* @author - Tanvir Shaikh
* @updatePassword - function to update password
* @param {*} req 
* @param {*} res 
* @returns 
*/
exports.updatePassword = async function (req, res) {
    try {
        const { email, newPassword } = req.body;
        const user = await findUser({ email });
        if (user) {
            const password = hashPasswordUsingBcrypt(newPassword);
            user.password = password;
            let passUpdateRes = await user.save();
            if (passUpdateRes) return res.json(response.success(200, message.user.UPDATE_PASSWORD))
            else return res.json(response.failure(400, message.user.FAILURE_RESET_PASSWORD))
        }
        if (!user) {
            return res.json(response.failure(400, message.user.FAILURE_RESET_PASSWORD))
        }
    } catch (error) {
        return res.json(response.failure(204, message.user.CATCH_ERROR, error));
    }
}