// models/User.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });


  // 테이블이랑 관계설정
  User.associate = (models) => {
    User.hasMany(models.GameRecord, {
      foreignKey: 'user_id',
      sourceKey: 'user_id'
    });

    User.hasOne(models.LearningStat, {
      foreignKey: 'user_id',
      sourceKey: 'user_id'
    });

    User.hasMany(models.Attendance, {
      foreignKey: 'user_id',
      sourceKey: 'user_id'
    });
    
    User.hasMany(models.BookmarkWord, {
      foreignKey: 'userId',
      sourceKey: 'user_id'
    });
  };


  return User;
};
