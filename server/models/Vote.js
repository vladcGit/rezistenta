const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const Player = require('./Player');
const Mission = require('./Mission');

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

Player.hasMany(Vote, { onDelete: 'CASCADE' });
Mission.hasMany(Vote, { onDelete: 'CASCADE' });

module.exports = Vote;
