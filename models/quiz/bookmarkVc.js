module.exports = (sequelize, DataTypes) => {
    const BookmarkVc = sequelize.define('BookmarkVc', {
        id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
        },
        userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        },
        onDelete: 'CASCADE'
        },
        vcId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'sign_vc',
            key: 'vc_id'
        },
        onDelete: 'CASCADE'
        }
    }, {
        tableName: 'bookmark_vc',
        timestamps: false
    });
    
    BookmarkVc.associate = (models) => {
        BookmarkVc.belongsTo(models.User, { foreignKey: 'userId' });
        BookmarkVc.belongsTo(models.SignVc, { foreignKey: 'vcId' });
    };
    
    return BookmarkVc;
    };