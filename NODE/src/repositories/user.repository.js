
const { UserModel } = require("../dao/models/users.model.js")
const { UserDto } = require("../dto/userDto.js")
const jwt = require('jsonwebtoken');
// capa de servicio
class UserRepository {
    constructor(){
        this.dao = UserModel
    }

    getUsers =   async () => await this.dao.find()
    getUserBy =  async (filter,password = false) =>{ 
        if (password) return await this.dao.findOne(filter).select("+password")
        return await this.dao.findOne(filter)
    }
    exists =   async (filter) => await this.dao.exists(filter)
    createUser = async (newUser) => {
        const newUsertDto = new UserDto(newUser)
        return await this.dao.create(newUsertDto)
    
    }
    generateJWT=  (user)=>{
        
        let payload = {
            id   : user._id,
        } 
        

        let accessToken = jwt.sign(payload,
            process.env.ACCESS_TOKEN_KEY,
            {expiresIn : process.env.ACCESS_TIME})
        let refreshToken = jwt.sign(payload,
                process.env.REFRESH_TOKEN_KEY,
                {expiresIn : process.env.REFRESH_TIME})
        
        
        const refreshExpireAt = new Date(Date.now() + (this.parseRefreshTime(process.env.REFRESH_TIME)) - 3 *  60 * 60 * 1000);
        
        return {accessToken,refreshToken,refreshExpireAt}
    }

    deleteJwt(user, token){
        user.refreshTokens = user.refreshTokens.filter((e) => e.token != token)
        return user
    }
    addJwt(user,token,expiry){
        const createdAt = new Date( Date.now() - 3 *  60 * 60 * 1000)
        user.refreshTokens.push(
            {
                token, 
                expiry, 
                createdAt
            })
        return user
    }   
    parseRefreshTime = (timeStr) =>{
        const units = {
            s: 1000,
            m: 1000 * 60,
            h: 1000 * 60 * 60,
            d: 1000 * 60 * 60 * 24
        };
    
        const unit = timeStr.slice(-1); // Obtiene la última letra
        const amount = parseInt(timeStr.slice(0, -1)); // Obtiene el número
    
        if (!units[unit] || isNaN(amount)) {
            throw new Error('Formato de tiempo no válido');
        }
    
        return amount * units[unit];
    }
    deleteExpiredTokens = (user) =>{
        const tokens = user.refreshTokens
        const now = new Date(Date.now() )
        console.log((now))
        console.log((user.refreshTokens))
        console.log((user.refreshTokens[0].expiry) > now)
        user.refreshTokens = tokens.filter(( element ) => element.expiry > now)
        return user
    }
    updateUser = async (uid, userToUpdate) => {
        //console.log("uid :", uid)
        //console.log("userToUpdate :", userToUpdate)
        return await this.dao.updateOne({_id:uid}, userToUpdate)
        
    }
    deleteUser = async (uid) => await this.dao.findByIdAndDelete({_id: uid})

}


module.exports = UserRepository;