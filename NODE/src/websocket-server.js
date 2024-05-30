const WebSocket = require('ws');
const http = require('http');

// Crear un servidor HTTP
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('WebSocket server\n');
});

// Crear un servidor WebSocket adjunto al servidor HTTP
const wss = new WebSocket.Server({ server });

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Manejar mensajes del cliente
  ws.on('message', (message) => {
    console.log(`Mensaje recibido: ${message}`);

    // Enviar un mensaje de vuelta al cliente
    ws.send(`Servidor: Recibí tu mensaje - ${message}`);
  });

  // Manejar cierre de conexión
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor en el puerto 8080
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor WebSocket escuchando en http://172.30.2.140:${port}`);
});
