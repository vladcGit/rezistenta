const express = require('express');
const cors = require('cors');
const sequelize = require('./models/sequelize');
const WebSocketServer = require('websocket').server;

const app = express();
app.use(express.json());
app.use(cors());

//import module
const Mission = require('./models/Mission');
const Player = require('./models/Player');
const Room = require('./models/Room');
const Vote = require('./models/Vote');

//import rute
app.use('/api/room', require('./routes/RoomRoutes'));

app.get('/', (req, res) => {
  res.send('hello');
});

const port = 3001;

const server = app.listen(port, async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log(`Pornit pe portul ${port}`);
});

// web-socket

const wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on('request', function (request) {
  const connection = request.accept('echo-protocol', request.origin);
  connection.on('message', async function (message) {
    if (message.type === 'utf8') {
      try {
        const { id } = JSON.parse(message.utf8Data);

        const room = await Room.findByPk(parseInt(id), {
          include: [{ model: Player, include: [Vote] }, { model: Mission }],
        });

        connection.sendUTF(JSON.stringify(room));
      } catch (e) {
        console.log(e);
        connection.sendUTF(JSON.stringify(e));
      }
    }
  });
  connection.on('close', function (connection) {
    console.log(new Date() + 'Peer disconnected.');
  });
});
