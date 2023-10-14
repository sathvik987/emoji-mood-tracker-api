const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "secret";

const jsonErrorHandler = (req, res, next, error) => {
    const errorObject = {
        api: req.originalUrl,
        message: error.message,
        stack: error.stack,
    };
    console.log(errorObject);
    res.status(500).json(errorObject);
    return next();
};

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json('Access token is required.');
        }

        try {
            let jwtPayload = await jwt.verify(token, accessTokenSecret);
            if (!jwtPayload || !jwtPayload.username) {
                throw Error;
            }
            let user = await User.findOne({ username: jwtPayload.username });
            if (!user) {
                return res.status(403).json('Invalid access token, user not found.');
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(403).json('Invalid access token.');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    jsonErrorHandler,
    authenticateToken
};