const mongoose = require("mongoose")
const dotenv = require('dotenv')
const { program } = require("../enviroment/commander")

const { mode } = program.opts()


dotenv.config({
    path: mode === 'development' ? '../enviroment/.env.development' : '../enviroment/.env.production'
})

exports.configObject = {
    path: process.env.MONGO_URL || "mongodb+srv://lqu:Jphlions135@cluster0.a4edk8z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
}

exports.connectDB = async () => {
    try {
        // await mongoose.connect(MONGO_URL)
        await mongoose.connect(exports.configObject.path)
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}