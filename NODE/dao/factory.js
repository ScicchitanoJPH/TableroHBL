const { configObject, connectDB } = require("../configDB/connectDB");


let EventDao
let DeviceDao


const EventDaoMongo = require("./Mongo/eventsDao.mongo")
EventDao = EventDaoMongo

const DeviceDaoMongo = require("./Mongo/devicesDao.mongo")
DeviceDao = DeviceDaoMongo


module.exports = {
    EventDao,
    DeviceDao
}

// let UserDao
// let ProductDao
// let CartsDao



// // persistence MONGO
// switch (configObject.persistence) {
//     case 'FILE':
//         const UserDaoFile = require("./File/userManagerFile")
//         UserDao = UserDaoFile


//         break;
//     case 'MEMORY':
        
//         break;

//     default:
//         // la linea de abajo es para import from
//         // const UserDaoMongo = (async import('./Mongo/usersDao.mongo')).default
//         connectDB()

//         const UserDaoMongo = require("./Mongo/usersDao.mongo")
//         UserDao = UserDaoMongo

//         const ProductDaoMongo = require("./Mongo/productsDao.mongo")
//         ProductDao = ProductDaoMongo

//         break;
// }

// module.exports = {
//     UserDao,
//     ProductDao
// }