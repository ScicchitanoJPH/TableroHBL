const EventRepository = require("./events.repository")
const DeviceRepository = require("./devices.repository")
const BoardRepository = require("./boards.repository")
// importación del dao a travez de factory
const { 
    EventDao,
    DeviceDao,
    BoardDao
} = require("../dao/models/factory")


// userSevice es un objeto con todos los métodos de repository
const eventService    = new EventRepository(new EventDao())
const deviceService    = new DeviceRepository(new DeviceDao())
const boardService    = new BoardRepository(new BoardDao())

module.exports = {
    eventService,
    deviceService,
    boardService
}