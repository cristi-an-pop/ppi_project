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
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  problem: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  x1: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  x2: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  y1: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  y2: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  caseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Case,
      key: 'id',
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

Case.hasMany(Tooth, {
  foreignKey: 'caseId',
  as: 'teeth'
});
Tooth.belongsTo(Case, {
  foreignKey: 'caseId'
});


module.exports = Tooth;