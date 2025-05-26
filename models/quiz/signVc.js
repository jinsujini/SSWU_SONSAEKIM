module.exports = (sequelize, DataTypes) => {
    const SignVc = sequelize.define('SignVc', {
        word_id: {
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
    /*
    북마크 기능 다른 브랜치 파서 작업 예정
    SignVc.associate = (models) => {
        SignVc.hasMany(models.BookmarkVc, {
        foreignKey: 'vcId',
        sourceKey: 'vc_id'
        });
    };
    */
    
    return SignVc;
    };