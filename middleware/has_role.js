const response = require('../utils/response');
const message = require("../utils/message");
const compose = require('composable-middleware');

const hasRole = roleRequired => {
  if (roleRequired === undefined)
    throw new Error('Required role needs to be set');
  return compose().use((req, res, next) => {
    console.log(req.user.role_id);

    let requiredRoles = roleRequired;
    if ((requiredRoles.indexOf(req.user.role_id) >= 0)) {
      next();
    } else {
      const failureResponse = {
        message: "You do not have authorization for accessing this module.",
        status: "Failure",
        code: 422
      };
      res.status(422).json(failureResponse);

      // res.status(422).json(response.failure(422, { "message": "You do not authorization for accessing this module." }));
    }
  });
};

module.exports = hasRole;