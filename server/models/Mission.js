const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');
const Player = require('./Player');

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
});

Mission.belongsToMany(Player, {
  through: 'Player_Missions',
  onDelete: 'CASCADE',
});
Player.belongsToMany(Mission, {
  through: 'Player_Missions',
  onDelete: 'CASCADE',
});

module.exports = Mission;
