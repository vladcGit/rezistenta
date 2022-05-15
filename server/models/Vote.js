const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  result: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Vote;
