const User = require('../models/user');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
exports.signup = async (req, res) => {
    try {
        const {
            username,
            email,
            password
        } = req.body;
        
        if (!username || !email || !password) {
            throw {
                status: 400,
                message: "Missing required fields"
            }
        }
        if (password.length < 6) {
            throw {
                status: 400,
                message: "Password must be at least 6 characters long"
            }
        }
        let user = await User.findOne({email});
        if (user) {
            throw {
                status: 400,
                message: "Email already registered"
            }
        }
        user = await User.findOne({username});
        if (user) {
            throw {
                status: 400,
                message: "Username already used"
            }
        }
        const stripeUser = await stripe.customers.create({
            email
        });
        const newUser = new User({
            stripeId: stripeUser.id,
            username,
            email,
            password
        });
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ message: error.message });
    }
}

// @route   POST api/auth/signin
// @desc    Login user
// @access  Public
exports.signin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        if (!email || !password) {
            throw {
                status: 400,
                message: "Missing required fields"
            }
        }
        const user = await User.findOne({email}).populate('password');
        if (!user) {
            throw {
                status: 400,
                message: "Email not registered"
            }
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw {
                status: 400,
                message: "Incorrect password"
            }
        }
        const tokens = await user.genTokens();
        res.status(200).json({ tokens });
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
}

// @route   POST api/auth/refresh
// @desc    Refresh jwt token
// @access  Public
exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            throw {
                status: 400,
                message: "Missing required fields"
            }
        }
        const user = await User.findOne({refreshToken}, "refreshToken refreshExpires");
        if (!user) {
            throw {
                status: 400,
                message: "Invalid refresh token"
            }
        }
        if (user.refreshExpires < Date.now()) {
            this.refreshExpires = '';
            this.refreshToken = '';
            throw {
                status: 400,
                message: "Refresh token expired"
            }
        }
        const tokens = await user.genTokens();
        res.status(200).json({ tokens });
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
}