const { Sequelize } = require('sequelize');

require('dotenv').config();
const config = require('../configs/config.js');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    port: config.development.port
  }
);

module.exports = sequelize;
