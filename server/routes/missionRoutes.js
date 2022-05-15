const express = require('express');
const Mission = require('../models/Mission');
const Player = require('../models/Player');
const Vote = require('../models/Vote');
const app = express();

app.post('/room/:id', async (req, res) => {
  try {
    const mission = await Mission.create({
      RoomId: req.params.id,
      id_creator: req.body.id_creator,
    });
    let arrayOfPromises = [];
    for (let player of req.body.players)
      arrayOfPromises.push(Player.findByPk(player));

    const players = await Promise.all(arrayOfPromises);
    arrayOfPromises = [];
    for (let player of players) arrayOfPromises.push(mission.addPlayer(player));

    await Promise.all(arrayOfPromises);

    res.status(200).json({ message: 'ok' });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.post('/vote', async (req, res) => {
  try {
    const mission = await Mission.findByPk(req.body.MissionId);
    const vot = await Vote.create(req.body);
    await mission.addVote(vot);
    res.status(200).json(mission);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.get('/:id', async (req, res) => {
  try {
    const mission = await Mission.findByPk(req.params.id, { include: Player });
    res.status(200).json(mission);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

module.exports = app;
