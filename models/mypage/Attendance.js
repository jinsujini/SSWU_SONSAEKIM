//  출석
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    attendance_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    tableName: 'attendances',
    timestamps: false,
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id',
    });
  };

  return Attendance;
};
