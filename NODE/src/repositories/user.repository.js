
const { UserModel } = require("../dao/models/users.model.js")
const { UserDto } = require("../dto/userDto.js")

// capa de servicio
class UserRepository {
    constructor(){
        this.dao = UserModel
    }

    getUsers =   async () => await this.dao.find()
    getUserBy =    async (filter) => await this.dao.findOne(filter)
    exists =   async (filter) => await this.dao.exists(filter)
    createUser = async (newUser) => {
        const newUsertDto = new UserDto(newUser)
        return await this.dao.create(newUsertDto)
    
    }
    updateUser = async (uid, userToUpdate) => {
        console.log("uid :", uid)
        console.log("userToUpdate :", userToUpdate)
        await this.dao.updateOne({_id:uid}, userToUpdate)
        
    }
    deleteUser = async (uid) => await this.dao.findByIdAndDelete({_id: uid})

}


module.exports = UserRepository;