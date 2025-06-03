module.exports = (sequelize, DataTypes) => {
  const GameRecord = sequelize.define('GameRecord', {
    game_record_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'game_record',
    timestamps: false
  });

  GameRecord.associate = (models) => {
    GameRecord.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id'
    });
  };

  return GameRecord;
};
