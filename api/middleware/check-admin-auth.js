const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;

        if (req.userData.role !== 'SA') {
            return res.status(401).json({
                status: "ERROR",
                code: 401,
                message: "Authentication Failed!",
                data: [],
                error: []
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            status: "ERROR",
            code: 401,
            message: "Authentication Failed!",
            data: [],
            error: []
        });
    }
};