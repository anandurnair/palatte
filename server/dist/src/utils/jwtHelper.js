"use strict";
var jwt = require('jsonwebtoken');
require('dotenv').config();
var generateToken = function (user) {
    console.log('key : ', '7e657ddd0578cdf66febd42caf0c66538e68e3d2fcb6a7621706f085588e084e');
    return jwt.sign({ userId: user._id }, '7e657ddd0578cdf66febd42caf0c66538e68e3d2fcb6a7621706f085588e084e', {
        expiresIn: 3 * 24 * 60 * 60,
    });
};
module.exports = { generateToken: generateToken };
//# sourceMappingURL=jwtHelper.js.map