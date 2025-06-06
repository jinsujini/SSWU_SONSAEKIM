module.exports = (sequelize, DataTypes) => {
    const BookmarkVc = sequelize.define('BookmarkVc', {
        id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
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
        }
    }, {
        tableName: 'bookmark_vc',
        timestamps: false
    });
    
    BookmarkVc.associate = (models) => {
        BookmarkVc.belongsTo(models.User, { foreignKey: 'user_id' });
        BookmarkVc.belongsTo(models.SignVc, { foreignKey: 'vc_id' });
    };
    
    return BookmarkVc;
    };