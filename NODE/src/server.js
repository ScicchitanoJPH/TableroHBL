const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { connectDB } = require('./configDB/connectDB.js');
const router = require('./routers/index.js');

const cookieParser = require('cookie-parser'); // Importa el middleware cookie-parser

const swaggerJsDocs = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')

const cors = require('cors');
const  {engine}  = require('express-handlebars'); // Destructuring for brevity

const path = require('path');
const dotenv = require('dotenv')
const { program } = require("./enviroment/commander")

const { mode } = program.opts()



dotenv.config({
    path: mode === 'development' ? path.resolve(__dirname, './enviroment/.env.development') : path.resolve(__dirname, './enviroment/.env.production')

})

exports.configObject = {
    port: process.env.PORT || 8080,
    url_mongo : process.env.MONGO_URL
}

console.log('process.env.port = ' + process.env.PORT)


const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(function(req, res, next) {

    res.locals.success = req.app.get('success');
    res.locals.error = req.app.get("error");

    req.app.set('success',undefined)
    req.app.set('error',undefined)
    next();
})

//seteo handlebars
app.use(express.static('public'));
app.engine('hbs', engine({defaultLayout:'index' ,extname:'.hbs'}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');



app.use("/api",router);

// sweagger config -> documentación
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de Tablero HBL',
            description: 'Descripción de nuestro proyecto'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDocs(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))



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

    fetch(`http://localhost:${exports.configObject.port}/api/events/`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

// Almacena todas las conexiones de clientes
const clients = new Map();

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    // Agregar la conexión del cliente al conjunto

    // Manejar mensajes del cliente
    ws.on('message', (message) => {
        console.log(`Mensaje recibido: ${message}`);
        const data = JSON.parse(message);
        // Antes de agregar un websocket a la lista de clientes, se verifica que no exista. Esto evita que haya dos websocket con el mismo ID
        if (!clients.get(data.from)) {
            clients.set(data.from, ws);
            console.log(`Nuevo cliente : ${data.from}`);
        }else {
            console.log("cliente ya conectado");
        }
        console.log("data: " + data.from);
        const targetClient = clients.get(data.to);
        if (targetClient && targetClient.readyState === WebSocket.OPEN) {
            targetClient.send(JSON.stringify(data));
        } else {
            console.log(`Cliente ${data.to} no conectado o no disponible`);
        }
        // broadcast(JSON.stringify(data), ws);
        saveDB(data)
    });

    // Manejar cierre de conexión
    ws.on('close', () => {
        console.log('Cliente desconectado');

        const rpi2delete = getKeyByValue(clients, ws);

        // Eliminar la conexión del cliente del conjunto al cerrar la conexión
        console.log('Client to remove: ' + rpi2delete);
        console.log("clients.delete(ws) : " + clients.delete(rpi2delete));
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


// Función para obtener la clave desde el valor
function getKeyByValue(map, value) {
    for (let [key, val] of map.entries()) {
        if (val === value) {
            return key;
        }
    }
    return null; // Retorna null si no se encuentra el valor
}

const port = exports.configObject.port || 8080
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
