const express = require('express');
const Player = require('../models/Player');
const Room = require('../models/Room');
const app = express();

app.post('/new', async (req, res) => {
  try {
    const getRandomId = async () => {
      let flag = true;
      while (flag) {
        const number = Math.floor(1000 + Math.random() * 9000);
        const room = await Room.findByPk(number);
        if (room == null) return number;
      }
    };
    const id = await getRandomId();
    const room = await Room.create({ id });
    res.status(201).json(room);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.get('/:id', async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id, { include: Player });
    if (room == null)
      return res.status(400).json({ error: 'That room does not exist' });
    return res.status(200).json(room);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

module.exports = app;
