import asyncio
import json
import websockets
import requests

MODE = 'ACCESS_CONTROL'
URI = "ws://localhost:8080"
ID_RPI = "RPI_BARRERA_EXAR"

async def add_device2BBDD():
    url_addDevice = "http://localhost:8080/api/devices"

    payload = json.dumps({
        "hbl_id": ID_RPI,
        "hbl_name": "Barrera ingreso 1",
        "client": "EXAR",
        "mac_address": "AB:AB:AB:AB:AB",
        "ip": "172.168.50.1",
        "mask": "255.255.255.0",
        "dns": "172.168.50.1",
        "last_connection": "20/05/2024",
        "mode": MODE,
        "ID_anydesk": "172 458 784"
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url_addDevice, headers=headers, data=payload)

    print(response.text)

async def send_message(websocket):
    sever_id = "html"
    msg = "ABIERTA"

    for i in range(20000000, 50000000):  # Envía 15 mensajes
        if msg == "ABIERTA":
            msg = "CERRADA"
        else:
            msg = "ABIERTA"
        message = json.dumps({
            "from": ID_RPI,
            "to": sever_id,
            "mode": MODE,
            "message": msg
        })
        await websocket.send(message)
        print("Mensaje enviado:", message)
        await asyncio.sleep(3)  # Espera 3 segundos entre cada mensaje

async def handle_messages(websocket):
    async for message in websocket:
        try:
            message_data = json.loads(message)
            print("message_data: ", message_data)
        except ValueError as e:
            print("Error:", e)

async def main():
    await add_device2BBDD()
    uri = URI
    print("Conectado a:", uri)

    async with websockets.connect(uri) as websocket:
        await asyncio.gather(
            send_message(websocket),
            handle_messages(websocket)
        )

asyncio.run(main())
