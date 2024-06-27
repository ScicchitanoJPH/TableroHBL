const passport = require("passport")
const local    = require("passport-local")
const jwt      = require("passport-jwt")
const { loginStrategy, registerStrategy } = require("./strategies/locals.strategies.js")
const UserRepository  = require("../../repositories/user.repository.js")

const LocalStrategy = local.Strategy
const JWTStrategy   = jwt.Strategy
const ExtractJWT    = jwt.ExtractJwt

const userRepository = new UserRepository()

const cookieExtractor = (req) =>{
    let token = null
    
    if ( req && req.cookies){
        return token = req.cookies._auth
    }

    token = null
}  

function initializePassport (){
    passport.use('login', new LocalStrategy({usernameField: "email"},loginStrategy))

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true, 
            usernameField: "email"
        },
        registerStrategy)) 

    passport.use("jwt",new JWTStrategy(
                {
                    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                    secretOrKey : process.env.ACCESS_TOKEN_KEY
                }
            
                ,async (jwt_payload,done)=>{
                        
                        try {
                            return done(null,jwt_payload)
                        } catch (error) {
                            
                            return done(error)
                        }
                }
            )
        )

    passport.serializeUser(function(user,done){
        console.log("ser")
        return done(null,user._id)
    })
    passport.deserializeUser(async function(id, done) {
        try {
            
            const user = userRepository.getUserBy({_id : id},false)
            console.log('deserialize', user)
            
            done(null, user);
        } catch (error) {
            done(error)
        }
        
        });
    
}

module.exports = { initializePassport }