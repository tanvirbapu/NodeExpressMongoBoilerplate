const hasRole = require('../../middleware/has_role');
const middleware = require('../../middleware/validation');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;
const { loginValidator } = require("./validator");
const { adminLogin } = require("./controller");

module.exports = (app) => {
    app.post('/adminLogin', middleware(loginValidator), adminLogin);
}
