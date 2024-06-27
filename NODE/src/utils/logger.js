const { createLogger, transports, format} = require("winston")

//const logname = 'server.log'

const customFormat = format.combine(format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),format.printf((info) =>{
    return `${info.timestamp} [${info.level.toUpperCase().padEnd(7)}] - ${info.message}`
}))

const logger = (logname)=>{
    return createLogger(
        {
            format : customFormat,
            transports: [
                new transports.Console({level: 'debug'}),
                new transports.File({filename: `./src/logs/${logname}`,level: 'info'})
            ]
        }
    )
}


module.exports = {logger};