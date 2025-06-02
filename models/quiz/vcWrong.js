module.exports = (sequelize, DataTypes) => {
    const VcWrong = sequelize.define('VcWrong', {
        vc_wrong_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
        },
        user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onDelete: 'CASCADE'
        },
        vc_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'sign_vc',
            key: 'vc_id'
        },
        onDelete: 'CASCADE'
        },
        is_follow: {
        type: DataTypes.BOOLEAN,
        allowNull: false
        },
        is_relearned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
        },
        created_at: {
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'vc_wrong',
        timestamps: false
    });

    VcWrong.associate = (models) => {
        VcWrong.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'user_id'
        });

        VcWrong.belongsTo(models.SignVc, {
        foreignKey: 'vc_id',
        targetKey: 'vc_id' 
        });
    };

    return VcWrong;
};