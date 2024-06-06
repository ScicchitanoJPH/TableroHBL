const { Router } = require('express')
const EventController = require('../controllers/event.controller')

const router = Router()

const {
    getEvents,
    getEventsbyDevice,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = new EventController()

router.get('/',        getEvents )
router.get('/byDevice/:device',        getEventsbyDevice )
router.get('/:uid',    getEvent) 
router.post('/',       createEvent) 
router.put('/:uid',    updateEvent) 
router.delete('/:uid', deleteEvent)

module.exports = router
