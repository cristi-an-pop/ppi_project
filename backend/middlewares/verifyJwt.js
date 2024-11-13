require('dotenv').config();

const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'accessTokenSecret';

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, accessTokenSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Invalid token' });
    }
};

module.exports = verifyJwt;