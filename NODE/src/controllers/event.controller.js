const EventRepository = require("../repositories/events.repository")
const { EventDto } = require("../dto/eventDto")


class EventController {
    constructor(){
        this.service = new EventRepository(new EventDto());
    }

    getEvents = async (req, res)=>{  
        try {
            const events = await this.service.getEvents()
            console.log(events)
            res.send(events)
        } catch (error) {
            res.send({status: 'error', message: error})
            
        }    
    }

    

    getEventsbyDevice = async (req, res)=>{
        const { device } = req.params
        const event = await this.service.getEvent({from: device})
    
        // console.log(req.params)
    
        res.send(event)
    }
    
    getEvent = async (req, res)=>{
        const { uid } = req.params
        const event = await this.service.getEvent({_id: uid})
    
        // console.log(req.params)
    
        res.send(event)
    }
    
    createEvent = async (req, res)=>{
        console.log(req.body)
        const {from, to, mode, message } = req.body
       
        const newEvent = {
            from,
            to,
            mode,
            message
        }
        console.log(newEvent)
    
        const result = await this.service.createEvent(newEvent)
    
        res.status(200).send({
            status: 'success',
            eventsCreate: result
        })
    }
    
    updateEvent =  async (req, res)=>{
        const {uid} = req.params
        const eventToUpdate = req.body
    
        const result = await this.service.updateEvent(uid, eventToUpdate)
    
        res.status(200).send({
            status: 'success',
            message: result
        })
    }
    
    deleteEvent =  async (req, res)=>{
        const { uid } = req.params
        const result = await this.service.deleteEvent( uid)
        res.send(result)
    }
}

module.exports = EventController