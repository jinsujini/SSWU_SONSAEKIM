//학습통계 

module.exports = (sequelize, DataTypes) => {
  const LearningStat = sequelize.define("LearningStat", {
    stat_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    continuous_days: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_study_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  }, {
    tableName: 'learning_stats',
    timestamps: false,
  });

  LearningStat.associate = (models) => {
    LearningStat.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id',
    });
  };

  return LearningStat;
};
