const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../config/keys');

module.exports = function(req, res, next) {
    // Get the token from the header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // verify the token
    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid'});
    }
}