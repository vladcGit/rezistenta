const express = require('express');
const Mission = require('../models/Mission');
const Player = require('../models/Player');
const Room = require('../models/Room');
const Vote = require('../models/Vote');
const app = express();

const actualizareLider = async (idRoom) => {
  const room = await Room.findByPk(idRoom);
  const liderActual = await Player.findOne({
    where: { RoomId: room.getDataValue('id'), is_lider: true },
  });
  const indexActual = liderActual.getDataValue('index_order');
  const players = await room.getPlayers();

  let indexViitor = indexActual + 1;
  if (indexViitor > players.length) indexViitor = 1;

  await liderActual.update({ is_lider: false });
  const urmatorulLider = await Player.findOne({
    where: { RoomId: room.getDataValue('id'), index_order: indexViitor },
  });
  await urmatorulLider.update({ is_lider: true });
};

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

    const room = await Room.findByPk(mission.getDataValue('RoomId'));
    const noVotesFail = await Vote.count({
      where: { MissionId: req.body.MissionId, result: false },
    });
    const noVotesSuccess = await Vote.count({
      where: { MissionId: req.body.MissionId, result: true },
    });

    // verific daca toti jucatorii au votat
    const players = await room.getPlayers();
    if (players.length === noVotesFail + noVotesSuccess) {
      const resultOfVote = noVotesFail >= noVotesSuccess ? 0 : 1;
      await mission.update({ is_starting: resultOfVote });

      //todo daca sunt 5 propuneri in care nu se pleaca se pierde jocul

      // actualizare lider in caz de esec
      if (resultOfVote === 0) await actualizareLider(room.getDataValue('id'));
    }

    res.status(200).json(mission);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.post('/result/:id', async (req, res) => {
  try {
    const mission = await Mission.findByPk(req.params.id);
    const room = await Room.findByPk(mission.getDataValue('RoomId'));

    let success_count = mission.getDataValue('success_count');
    let fail_count = mission.getDataValue('fail_count');
    if (req.body.result) success_count++;
    else fail_count++;
    await mission.update({ success_count, fail_count });

    const noPlayers = (await mission.getPlayers()).length;
    const noMissions = (await room.getMissions()).length;
    if (noPlayers === success_count + fail_count) {
      let finalResult;
      if (noPlayers >= 7 && noMissions == 4) {
        if (fail_count > 1) finalResult = false;
        else finalResult = true;
      } else {
        if (fail_count > 0) finalResult = false;
        else finalResult = true;
      }

      await mission.update({ is_success: finalResult ? 1 : 0 });

      // actualizare lider
      await actualizareLider(room.getDataValue('id'));

      //todo verifica cine castiga sau pierde jocul
    }
    res.status(200).json({ message: 'ok' });
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
