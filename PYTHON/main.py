import asyncio
import json
import websockets
import requests
import json

MODE = 'ACCESS_CONTROL'
URI = "ws://172.30.2.140:8080"
ID_RPI = "RPI_ACCESS_CONTROL"

async def add_device2BBDD():
    url_addDevice = "http://localhost:8080/api/devices"

    payload = json.dumps({
    "hbl_id": ID_RPI,
    "ip": "172.168.50.1",
    "mask": "255.255.255.0",
    "dns": "172.168.50.1",
    "last_connection": "20/05/2024",
    "mode": MODE
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url_addDevice, headers=headers, data=payload)

    print(response.text)


async def send_message():
    uri = URI
    sever_id = "server"
    
    async with websockets.connect(uri) as websocket:
        for i in range(20000000, 50000000):  # Envía 15 mensajes
            message = "{\"from\": \"%s\",\"to\": \"%s\",\"mode\": \"%s\",\"message\": \"%d\"}" % (ID_RPI, sever_id, MODE, i)
            await websocket.send(message)
            #print("Mensaje enviado:", message)
            await asyncio.sleep(3)  # Espera 3 segundos entre cada mensaje


async def handle_messages():
    uri = URI
    print("Conectado a:", uri)
    async with websockets.connect(uri) as websocket:
        async for message in websocket:
            try:
                message_data = json.loads(message)
                #id_message = message_data["to"]
                #print("Mensaje recibido de :", id_message)
                if message_data["to"] == ID_RPI:
                    print("Mensaje recibido:", message)
                else:
                    print("Mensaje enviado")
            except ValueError as e:
                print("Error:", e)
                #print("Mensaje recibido:", message)



async def main():
    await asyncio.gather(add_device2BBDD(),send_message(), handle_messages())

asyncio.run(main())



