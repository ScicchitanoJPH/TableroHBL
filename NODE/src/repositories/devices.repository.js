const { DeviceDto } = require("../dto/deviceDto")
const { deviceModel } = require("../dao/models/device.model")

// capa de servicio
class DeviceRepository {
    constructor(){
        this.dao = deviceModel
    }

    getDevices =   async () => await this.dao.find()
    getDevice =    async (filter) => await this.dao.find(filter)
    exists =   async (filter) => await this.dao.exists(filter)
    createDevice = async (newDevice) => {
        const newDeviceDto = new DeviceDto(newDevice)
        return await this.dao.create(newDeviceDto)
    
    }
    updateDevice = async (uid, deviceToUpdate) => {
        console.log("uid :", uid)
        console.log("deviceToUpdate :", deviceToUpdate)
        await this.dao.updateOne({hbl_id:uid}, deviceToUpdate)
        
    }
    deleteDevice = async (uid) => await this.dao.findByIdAndDelete({_id: uid})

}


module.exports = DeviceRepository