const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let messages = []; // Array per memorizzare i messaggi

io.on('connection', (socket) => {
  let username = '';

  // Invia i messaggi memorizzati al nuovo utente
  socket.emit('previousMessages', messages);

  socket.on('setUsername', (name) => {
    username = name;
    console.log(`User connected: ${username}`);
  });

  socket.on('messaggio', (msg) => {
    if (username) {
      const formattedMsg = `${username}: ${msg}`;
      console.log(`Messaggio ricevuto: ${formattedMsg}`);
      messages.push(formattedMsg); // Aggiungi il messaggio all'array
      io.emit('messaggio', formattedMsg);
    } else {
      console.log('Messaggio ricevuto senza username.');
    }
  });

  socket.on('disconnect', () => {
    if (username) {
      console.log(`User disconnected: ${username}`);
    } else {
      console.log('Un utente si è disconnesso senza aver impostato un username.');
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('Server in ascolto su *:3000');
});
