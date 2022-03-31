const express = require('express');
const cors = require('cors');
const sequelize = require('./models/sequelize');

const app = express();
app.use(express.json());
app.use(cors());

//import module
require('./models/Mission');
require('./models/Player');
require('./models/Room');
require('./models/Vote');

//import rute
app.use('/room', require('./routes/RoomRoutes'));

app.get('/', (req, res) => {
  res.send('hello');
});

const port = 3001;
app.listen(port, async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log(`Pornit pe portul ${port}`);
});
