const bcrypt = require('bcrypt');
const auth = require("../../utils/auth");
const generateToken = auth.generateToken;
const message = require('../../config/message');
const response = require('../../utils/response');
const users = require('../../database/users');
const { createActivity } = require('./db_query');

/**
 *@author - tanvir shaikh
 * @adminLogin - Admin Login
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

exports.adminLogin = async function (req, res) {
    try {
        const { email, password } = req.body;
        const userData = await users.findOne({ email: email, role_id: 1 });
        if (!userData) return res.json(response.failure(404, message.ADMIN_DOES_NOT_EXISTS));
        const result = await bcrypt.compare(password, userData.password);
        if (!result)
            return res.json(response.success(204, message.PASSWORD_INCORRECT));
        const token = generateToken({ userId: userData._id });
        userData.authToken = token;
        await userData.save();
        return res.json(response.success(200, message.ADMIN_LOGIN, { token: token }));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.CATCH_ERROR, error));
    }
}