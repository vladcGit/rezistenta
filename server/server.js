const express = require('express');
const cors = require('cors');
const sequelize = require('./models/sequelize');

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

app.get('/', (req, res) => {
  res.send('hello');
});

const port = 3001;

const server = app.listen(port, async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  console.log(`Pornit pe portul ${port}`);
});

let noOfRequests = 0;

// web-socket
const io = require('socket.io')(server, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('connection', null);
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
      io.emit('room', response);
      console.log(++noOfRequests);
    }
  });
  socket.on('disconnect', () => console.log('client deconectat'));
});
