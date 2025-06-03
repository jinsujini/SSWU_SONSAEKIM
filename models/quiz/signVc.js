module.exports = (sequelize, DataTypes) => {
    const SignVc = sequelize.define('SignVc', {
        vc_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
        },
        image: {
        type: DataTypes.STRING(255),
        allowNull: false
        },
        description: {
        type: DataTypes.STRING(100),
        allowNull: false
        }
    }, {
        tableName: 'sign_vc',
        timestamps: false
    });
    
    SignVc.associate = (models) => {
        SignVc.hasMany(models.BookmarkVc, {
            foreignKey: 'vc_id',
            sourceKey: 'vc_id'
        });
    
        SignVc.hasMany(models.VcWrong, {
            foreignKey: 'vc_id',
            sourceKey: 'vc_id'
        });
    };
    
    
    return SignVc;
    };