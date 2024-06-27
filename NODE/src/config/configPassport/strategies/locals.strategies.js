const UserRepository  = require("../../../repositories/user.repository.js")
const bcrypt = require('bcrypt')
const { logger } = require("../../../utils/logger.js")

const userRepository = new UserRepository()


const log = logger('auth.log')
async function loginStrategy (username,password,done) {
    try {
        
        let user =  await userRepository.getUserBy({email : username},true)
        if (!user){
            log.error(`(loginStrategy) Invalid user ${username}`)
            return done(null,false,{ message: " Invalid email or password"} )
        }
        const isValidPassword = await bcrypt.compare(password,user.password)
        
        if (!isValidPassword) {
            log.error(`(loginStrategy) Invalid password user ${user.name} id: ${user._id} pwd: ${password}`)
            return done(null,false,{ message: " Invalid email or password"} )
        }
        
        return done(null,user)
        
    } catch (error) {
        log.error(`(loginStrategy) ${username} ${password} error: ${error}`)
        done(error)
    }
}
async function registerStrategy( req, username,password,done){
    try {
        const userData = req.body;
        
        const existingUser = await userRepository.getUserBy({email : username});
        
        if (existingUser) {
            log.error(`(registerStrategy) Email already exist ${username}`)
            return done(null,false,{message : 'Email already exist'})
        }

        userData.password = await bcrypt.hashSync(userData.password, 10)
        
        const newUser = await userRepository.createUser(userData)
        if (!newUser) {
            
            log.error(`(registerStrategy) No se pudo crear el usuario con userData ${userData}`)
            return done(null,false, {message: 'No se pudo crear el usuario'})
        }

        done(null,newUser)

      
          
    } catch (error) {
        log.error(`(registerStrategy) ${username} error: ${error}`)
        done(error)
    }
}

module.exports = {loginStrategy,registerStrategy}