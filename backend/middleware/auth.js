
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });
      req.user = { id: decoded.id };  // Ensure decoded token contains id
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
};

module.exports = { verifyToken };
