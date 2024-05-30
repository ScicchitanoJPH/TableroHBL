const EventRepository = require("./events.repository")
const DeviceRepository = require("./devices.repository")
// importación del dao a travez de factory
const { 
    EventDao,
    DeviceDao
} = require("../dao/factory")


// userSevice es un objeto con todos los métodos de repository
const eventService    = new EventRepository(new EventDao())
const deviceService    = new DeviceRepository(new DeviceDao())

module.exports = {
    eventService,
    deviceService
}