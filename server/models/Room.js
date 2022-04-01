const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const Player = require('./Player');
const Mission = require('./Mission');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  is_finished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Room.hasMany(Player, { onDelete: 'CASCADE' });
Room.hasMany(Mission, { onDelete: 'CASCADE' });

module.exports = Room;
