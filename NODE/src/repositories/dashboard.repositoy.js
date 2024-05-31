const { DashboardDto } = require("../dto/dashboardDto")
const { DashboardModel } = require("../dao/models/dashboard.model")

// capa de servicio
class DashboardRepository {
    constructor(){
        this.dao = DashboardModel
    }

    async getAll()  {
        await this.dao.find()
    }
    async search(filter) { 
        await this.dao.find(filter)
    }
    async exists(filter){
        await this.dao.exists(filter)
    }
    async create(){
        const newDashboardDto = new DashboardDto()
        return await this.dao.create(newDashboardDto)
        
    }
    async updateDevice(dashid, deviceToUpdate)  {
        console.log("dashid :", dashid)
        console.log("deviceToUpdate :", deviceToUpdate)
        await this.dao.updateOne({_id:dashid}, deviceToUpdate)
        
    }
    async deleteOne(uid){ 
        await this.dao.delete({_id: dashid})
    }
    async addDevice(dashid, deviceToAdd){
        console.log("dashid :", dashid)
        console.log("deviceToAdd :", deviceToAdd)
        await this.dao.addDevice({_id:dashid}, deviceToAdd)
        
    }
    async deleteDevice(dashid, deviceToDelete){
        console.log("dashid :", dashid)
        console.log("deviceToDelete :", deviceToDelete)
        await this.dao.deleteDevice({_id:dashid}, deviceToDelete)
        
    }
}


module.exports = DashboardRepository 