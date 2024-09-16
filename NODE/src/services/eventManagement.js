const path = require('path');
const dotenv = require('dotenv')
const { program } = require("../enviroment/commander")
const { mode } = program.opts()
const fs = require('fs');
const WebSocket = require('ws');

dotenv.config({
    path: mode === 'development' ? path.resolve(__dirname, './enviroment/.env.development') : path.resolve(__dirname, './enviroment/.env.production')

})

exports.configObject = {
    port: process.env.PORT || 8080,
    url_mongo : process.env.MONGO_URL
}



// Ruta al archivo JSON
const peopleAmountFilePath = path.resolve(__dirname, './peopleAmount.json');

// Leer el valor de peopleAmount desde el archivo JSON
function getPeopleAmount() {
    if (fs.existsSync(peopleAmountFilePath)) {
        const data = fs.readFileSync(peopleAmountFilePath, 'utf8');
        const json = JSON.parse(data);
        return json.peopleAmount || 0;
    } else {
        return 0; // Valor por defecto si no existe el archivo
    }
}

// Guardar el valor de peopleAmount en el archivo JSON
function savePeopleAmount(value) {
    const json = { peopleAmount: value };
    fs.writeFileSync(peopleAmountFilePath, JSON.stringify(json), 'utf8');
}


async function saveDB(eventData) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Crear el objeto que se enviará, incluyendo `createdAt` si está presente
    var eventPayload = {
        "from": eventData.from,
        "to": eventData.to,
        "mode": eventData.mode,
        "message": eventData.message
    };

    // Agregar createdAt al payload solo si está presente en eventData
    if (eventData.createdAt) {
        eventPayload.createdAt = eventData.createdAt;
    }

    var raw = JSON.stringify(eventPayload);

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





// Función para retransmitir un mensaje a todos los clientes, excepto al cliente que envió el mensaje original
function broadcast(message, sender, clients) {
    clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            object = {"message": message}
            client.send(JSON.stringify(object));
        }
    });
}



exports.eventManagement = async (target, event, clients)=>{


    if(event.message === "Hi") return null;

    if(event.mode == "People Counter"){
        let peopleAmount = getPeopleAmount()
        const message = event.message
        //console.log("message.evento : " + message.event)
        //console.log(message.evento)
        if(message.evento == "IN"){
            peopleAmount++;
        }else{
            if(peopleAmount>0){
                peopleAmount--;
            }else{
                peopleAmount = 0;
            }
        }
        savePeopleAmount(peopleAmount)
        
        //event.message = event.message + " : " + String(peopleAmount)
        const response = {
            "evento" : "actualizacionCuenta",
            "personasDentro" : peopleAmount
        } 
        broadcast(response, "server", clients);
    }
    
    if (target && target.readyState === WebSocket.OPEN) {
        target.send(JSON.stringify(event));
    } else {
        console.log(`Cliente ${event.to} no conectado o no disponible`);
    }


    saveDB(event);
}