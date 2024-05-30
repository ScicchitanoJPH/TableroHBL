const mongoose = require("mongoose")
const dotenv = require('dotenv')
const { program } = require("../enviroment/commander")

const { mode } = program.opts()


dotenv.config({
    path: mode === 'development' ? '../enviroment/.env.development' : '../enviroment/.env.production'
})



exports.connectDB = async () => {
    try {
        // await mongoose.connect(MONGO_URL)
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}