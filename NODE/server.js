const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { connectDB } = require('./configDB/connectDB.js');
const eventRouter = require('./routers/event.router');
const deviceRouter = require('./routers/device.router');
const cookieParser = require('cookie-parser'); // Importa el middleware cookie-parser
// const dotenv = require('dotenv')
const cors = require('cors');

const dotenv = require('dotenv')
const { program } = require("./enviroment/commander")

const { mode } = program.opts()


dotenv.config({
    path: mode === 'development' ? './enviroment/.env.development' : './enviroment/.env.production'
})


exports.configObject = {
    port: process.env.PORT || 8080
}

console.log('exports.configObject.port = ' + exports.configObject.port)


const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api/events', eventRouter);
app.use('/api/devices', deviceRouter);

connectDB();

async function saveDB(eventData) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "from": eventData.from,
    "to": eventData.to,
    "mode": eventData.mode,
    "message": eventData.message
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(`http://172.30.2.140:${exports.configObject.port}/api/events/`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

// Almacena todas las conexiones de clientes
const clients = new Set();

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    // Agregar la conexión del cliente al conjunto
    clients.add(ws);

    // Manejar mensajes del cliente
    ws.on('message', (message) => {
        console.log(`Mensaje recibido: ${message}`);
        const data = JSON.parse(message);
        //const response = { source: 'server', message: `Recibí tu mensaje - ${data.message}` };
        // Reenviar el mensaje a todos los clientes, excepto al que envió el mensaje original
        // console.log(`Mensaje a enviar: ${data.message}`)
        broadcast(JSON.stringify(data), ws);
        saveDB(data)    
    });

    // Manejar cierre de conexión
    ws.on('close', () => {
        console.log('Cliente desconectado');
        
        // Eliminar la conexión del cliente del conjunto al cerrar la conexión
        clients.delete(ws);
    });
});

// Función para retransmitir un mensaje a todos los clientes, excepto al cliente que envió el mensaje original
function broadcast(message, sender) {
    clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
const port = exports.configObject.port || 8080
server.listen(port, () => {
    console.log(`Servidor escuchando en http://172.30.2.140:${port}`);
});
