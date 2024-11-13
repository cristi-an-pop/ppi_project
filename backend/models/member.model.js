const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/db.config');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['firstName', 'lastName', 'country', 'city']
    }
  ]
});

module.exports = Member;
