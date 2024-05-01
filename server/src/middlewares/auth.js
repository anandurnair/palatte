const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  console.log('worked');
  console.log("Req Headers : ", req.headers.authorization); // Changed to lowercase
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null; // Changed to lowercase and split by space
  console.log("Token1 :", token);
  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, 'cdd4440f0e59b271b03c2726618bcd7a36c49e6a4d1858a1c49b3d228f1b93f7', (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log('Verified token');
    next();
  });
};

module.exports = verifyToken;