const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../configs/config.js')[env];

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    if (typeof model === 'function') {
      const loadedModel = model(sequelize, Sequelize.DataTypes);
      db[loadedModel.name] = loadedModel;
    }
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const DataTypes = Sequelize.DataTypes;

db.Quiz = require('./quiz/quiz')(sequelize, DataTypes);
db.BookmarkWord = require('./quiz/bookmarkWord')(sequelize, Sequelize.DataTypes);
db.SignWord = require('./quiz/signWord')(sequelize, Sequelize.DataTypes);
db.SignVc = require('./quiz/signVc')(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
