const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user :any) => {
    console.log('key : ',process.env.JWT_SECRET)
    return jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};

module.exports = { generateToken };