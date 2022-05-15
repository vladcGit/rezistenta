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
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    validate: { isIn: [[-1, 0, 1]] },
  },
  is_success: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    validate: { isIn: [[-1, 0, 1]] },
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
