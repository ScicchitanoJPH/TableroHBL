






function isLogin (req,res,next) {
    console.log(req.session)
    if(req.isAuthenticated()) {
        next();
    } 
    else {
        res.status(401).json({ status: "Error", msg: "Usuario no logueado"});
    }
} 

module.exports = { isLogin };