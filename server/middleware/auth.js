const jwt = require("jsonwebtoken")


const JWT_SECRET = process.env.JWT_SECRET


const authenticateToken = (req, res, next) => {
    const token = req.cookies.token
    
    if (!token) {
        return res.status(401).json({error: "Access denied. No token provided."})
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token.' });
    }
}

module.exports = authenticateToken