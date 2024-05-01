const jwt = require('jsonwebtoken');
const SECRET_KEY ="cdd4440f0e59b271b03c2726618bcd7a36c49e6a4d1858a1c49b3d228f1b93f7";  // Store this securely!
const generateToken = (user) => {
    console.log('secreet : ',SECRET_KEY)
    return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
        expiresIn: '1h'
    });
};
const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};
module.exports = { generateToken, verifyToken };