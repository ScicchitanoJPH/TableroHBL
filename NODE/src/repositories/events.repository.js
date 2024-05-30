const { EventDto } = require("../dto/eventDto")
const { eventModel } = require("../dao/models/event.model")

// capa de servicio
class EventRepository {
    constructor(){
        this.dao = eventModel
    }

    getEvents =   async () => await this.dao.find()
    getEvent =    async (filter) => await this.dao.find(filter)
    createEvent = async (newEvent) => {
        const newEventDto = new EventDto(newEvent)
        return await this.dao.create(newEventDto)
    
    }
    updateEvent = async (uid, eventToUpdate) => await this.dao.update(uid, eventToUpdate)
    deleteEvent = async (uid) => await this.dao.delete({_id: uid})

}


module.exports = EventRepository