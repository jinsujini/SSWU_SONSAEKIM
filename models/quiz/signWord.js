module.exports = (sequelize, DataTypes) => {
const SignWord = sequelize.define('SignWord', {
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
    tableName: 'sign_word',
    timestamps: false
});

SignWord.associate = (models) => {
    SignWord.hasMany(models.BookmarkWord, {
    foreignKey: 'word_id',
    sourceKey: 'word_id'
    });
    SignWord.hasMany(models.WordWrong, {
        foreignKey: 'word_id',
        sourceKey: 'word_id'
    });
};

return SignWord;
};