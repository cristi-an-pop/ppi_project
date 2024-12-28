const config = require('./config');

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  host: config.dev.host,
  username: config.dev.username,
  password: config.dev.password,
  database: config.dev.database,
  port: config.dev.dbPort,
  dialect: 'postgres',
});

module.exports = sequelize;
