const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // 1. Get the token from the request header
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        // 2. Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Add the user ID to the request so the next function knows who is calling
        req.user = decoded.userId;
        
        // 4. Move to the next step (the actual route)
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};