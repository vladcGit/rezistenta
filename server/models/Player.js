const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const Vote = require('./Vote');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 30],
    },
  },
  index_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      len: [1, 10],
    },
  },
  is_lider: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  is_spy: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Player.hasMany(Vote, { onDelete: 'CASCADE' });

module.exports = Player;
