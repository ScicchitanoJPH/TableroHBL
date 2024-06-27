const jwt = require('jsonwebtoken');


checkSessionAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next()}
    res.redirect("/login")
}



function authenticateJwtUser (req,res,next) {
    try {
        
        const token = req.cookies._auth;
        //console.log(token)
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_KEY);

        req.userId = decodedToken.userId; 

        next()
    } catch (error){
        console.error('Error authenticating user:', error.message);
        res.status(401).json({error : 'Unauthorized'})
    }
} 

module.exports = { authenticateJwtUser ,checkSessionAuthenticated};