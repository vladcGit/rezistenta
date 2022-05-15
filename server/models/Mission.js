const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const Player = require('./Player');
const Vote = require('./Vote');

const Mission = sequelize.define('Mission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  is_starting: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  is_success: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  id_creator: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  success_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  fail_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

Mission.belongsToMany(Player, {
  through: 'Player_Missions',
  onDelete: 'CASCADE',
});
Player.belongsToMany(Mission, {
  through: 'Player_Missions',
  onDelete: 'CASCADE',
});

Mission.hasMany(Vote, { onDelete: 'CASCADE' });

module.exports = Mission;
