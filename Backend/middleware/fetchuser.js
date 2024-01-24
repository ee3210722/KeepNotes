const jwt = require('jsonwebtoken');
const JWT_SECRET = 'harshitisagoo$d%boy';

const fetchuser = (req, res, next) => {
    // get the user form the jwt token and add the id to req object.
    const token = req.header('auth-token');
    if (!token) res.status(401).send({ error: "Please authenticate using a valid token" });
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user; 
        next();
    } catch {
        res.status(401).send({ error: "Please authenticate using a valid token" }); 
    }
    
}

module.exports = fetchuser;