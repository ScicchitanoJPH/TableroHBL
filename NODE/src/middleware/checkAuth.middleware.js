const jwt = require('jsonwebtoken');






function authenticateUser (req,res,next) {
    try {
        
        const token = req.cookies.token;
        
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);

        req.userId = decodedToken.userId; 

        next()
    } catch (error){
        console.error('Error authenticating user:', error);
        res.status(401).json({error : 'Unauthorized'})
    }
} 

module.exports = { authenticateUser};