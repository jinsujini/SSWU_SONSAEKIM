module.exports = (sequelize, DataTypes) => {
const BookmarkWord = sequelize.define('BookmarkWord', {
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
    wordId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
        model: 'sign_word',
        key: 'word_id'
    },
    onDelete: 'CASCADE'
    }
}, {
    tableName: 'bookmark_word',
    timestamps: false
});

BookmarkWord.associate = (models) => {
    BookmarkWord.belongsTo(models.User, { foreignKey: 'userId' });
    BookmarkWord.belongsTo(models.SignWord, { foreignKey: 'wordId' });
};

return BookmarkWord;
};