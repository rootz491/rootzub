const User = require('../models/user');

exports.getUser = async (id, includes) => {
    try {
        const user = await User.findOne({_id: id}, includes);
        if (!user) {
            throw {
                status: 404,
                msg: 'User not found'
            };
        }
        return user;
    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.deleteUser = async (id) => {
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw {
                status: 404,
                msg: 'User not found'
            };
        }
        return user;
    } catch (error) {
        console.log(error);
        return false;
    }
}