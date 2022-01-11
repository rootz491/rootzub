const { getUser, deleteUser } = require('../services/user');

// @route   GET api/user
// @desc    Get current user's info
// @access  Protected
exports.getMe = async (req, res) => {
    try {
        const user = await getUser(req.user._id, "-password -__v -refreshToken -refreshExpires");
        if (!user) {
            throw {
                status: 404,
                msg: 'User not found'
            };
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ message: error.msg });
    }
}

// @route   GET api/user/:id
// @desc    Get user by id
// @access  Protected
exports.getByParam = async (req, res) => {
    try {
        const user = await getUser(req.params.id, "username stripeId isSubscribed email createdAt");
        if (!user) {
            throw {
                status: 404,
                msg: 'User not found'
            };
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ message: error.msg });
    }
}

// @route   DELETE api/user/
// @desc    Delete user by id
// @access  Protected
exports.deleteMe = async (req, res) => {
    try {
        const password = req.body.password;
        if (!password)
            throw {
                status: 400,
                msg: 'password is required!'
            }
        const user = await getUser(req.user._id, "password");
        const correctPassword = await user.comparePassword(password);
        if (!correctPassword)
            throw {
                status: 400,
                msg: 'incorrect password'
            }
        const deleted = await deleteUser(req.user._id);
        if (!deleted) {
            throw {
                status: 400,
                msg: 'something went wrong, please try again later!'
            };
        }
        res.json({success: true});
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ message: error.msg });
    }
}