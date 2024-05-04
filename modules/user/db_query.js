var ObejctID = require("mongoose").Types.ObjectId
// const user = require("./schema");
const user = require("../../database/users");


/**
* @author - Tanvir Shaikh
* @checkEmpExist -function to check Employee Exist
* @param {*} data
* @returns 
*/
module.exports.checkUserExist = async (data) => {
    return await user.findOne(data);
}


/**
* @author - Tanvir Shaikh
* @findUser - function to find user
* @param {*} data
* @returns 
*/
module.exports.findUser = async (data) => {
    return await user.findOne(data);
}

/**
* @author - Tanvir Shaikh
* @getUserDetail - function to get user details
* @param {*} data
* @returns 
*/
module.exports.getUserDetail = async (data) => {
    return await user.findOne(data).select({ __v: 0, password: 0, role_id: 0 });
}

/**
* @author - Tanvir Shaikh
* @createUser - function to create user
* @param {*} data
* @returns 
*/
module.exports.createUser = async (data) => {
    return await user.create(data);
}

/**
* @author - Tanvir Shaikh
* @getUser - function to get user details
* @param {*} data
* @returns 
*/
module.exports.getUser = async (data) => {
    return await user.findOne(data).select({ _id: 1, role_id: 2 });
}

/**
 *@author - Tanvir Shaikh
* @updateUserProfile - function to update user profile
* @param {*} data
* @returns 
*/
module.exports.updateUserProfile = async (data) => {
    return await user.findOneAndUpdate({
        _id: data.user._id
    }, {
        ...data.body
    }, {
        new: true
    }).select({ __v: 0, password: 0, role_id: 0 });
}

/**
 * @author - Tanvir Shaikh
 * @removeUser - Remove remove user
 * @param {*} id
 * @returns 
 */
module.exports.removeUser = async (id) => {//soft delete
    let userDeleteRes = await user.findByIdAndUpdate(id, { isDelete: true });
    if (userDeleteRes) {
        await userDeatail.updateOne({ user_id: ObejctID(id) }, { $set: { isDelete: true } });
        await userLastPassword.updateOne({ user_id: ObejctID(id) }, { $set: { isDelete: true } });
        await role.updateOne({ user_id: ObejctID(id) }, { $set: { isDelete: true } });
    }
    return userDeleteRes;
}