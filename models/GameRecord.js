module.exports = (sequelize, DataTypes) => {
    return sequelize.define("GameRecord", {
      game_record_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'game_record',
      timestamps: false,
    });
  };
  