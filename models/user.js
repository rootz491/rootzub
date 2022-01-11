const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    stripeId: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        required: true,
        maxlength: 30,
        unique: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        maxlength: 255
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isSubscribed: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String
    },
    refreshExpires: {
        type: Date
    }
});

// hashing password
userSchema.pre('save', function (next) {
    const user = this;

    // if password not modified, skip hashing 
    if (!user.isModified('password')) return next();

    // if password is modified, hash it
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

// compare password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// generate jwt token
userSchema.methods.genTokens = function () {
    const isAdmin = this.email === process.env.ADMIN_EMAIL ? true : false;  //  check if current user is admin (me)
    try {
        const authToken = jwt.sign(
            {                       // payload
                _id: this._id,
                stripeId: this.stripeId,
                username: this.username,
                email: this.email,
                isSubscribed: this.isSubscribed, //  if user is admin, isPro is true
                isAdmin 
            }, 
            process.env.JWT_SECRET, // secret
            { expiresIn: "30m" }    // expires in 30 minutes
        );
        const refreshToken = crypto.randomBytes(16).toString('hex');
        this.refreshToken = refreshToken;
        this.refreshExpires = Date.now() + 518400000; //  6 days from now
        this.save();
        return {
            authToken,
            refreshToken
        };
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = mongoose.model('User', userSchema);
