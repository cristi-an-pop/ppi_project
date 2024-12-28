const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Case = require('./case.model');

const Tooth = sequelize.define('Tooth', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  problems: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  x1: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  y1: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  x2: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  y2: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  caseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Case,
      key: 'id',
    },
  },
});

module.exports = Tooth;