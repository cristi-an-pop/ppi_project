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
    allowNull: true,
  },
  problems: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  x1: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  y1: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  x2: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  y2: {
    type: DataTypes.INTEGER,
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
});

Case.hasMany(Tooth, {
  foreignKey: 'caseId',
  as: 'teeth'
});
Tooth.belongsTo(Case, {
  foreignKey: 'caseId'
});


module.exports = Tooth;