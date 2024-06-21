"use strict";
var jwt = require('jsonwebtoken');
require('dotenv').config();
var generateToken = function (user) {
    console.log('key : ', process.env.JWT_SECRET);
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};
module.exports = { generateToken: generateToken };
//# sourceMappingURL=jwtHelper.js.map