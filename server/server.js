const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./models/sequelize');
require('dotenv').config();

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
app.use('/api/mission', require('./routes/missionRoutes'));

const port = process.env.PORT || 3001;

const server = app.listen(port, async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  console.log(`Pornit pe portul ${port}`);
});

// web-socket
const io = require('socket.io')(server, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  const { id } = socket.handshake.query;
  const roomName = 'room-' + id;

  socket.join(roomName);

  io.to(roomName).emit('connection', null);
  socket.on('update', async function (message) {
    let response;
    try {
      const { id } = JSON.parse(message);
      const room = await Room.findByPk(parseInt(id), {
        include: [
          { model: Player },
          { model: Mission, include: [Player, Vote] },
        ],
      });

      response = JSON.stringify(room);
    } catch (e) {
      console.log(e);
      response = JSON.stringify(e);
    } finally {
      io.to(roomName).emit('room', response);
    }
  });
});

const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
