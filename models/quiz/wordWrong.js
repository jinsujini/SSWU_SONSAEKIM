module.exports = (sequelize, DataTypes) => {
    const WordWrong = sequelize.define('WordWrong', {
        word_wrong_id: {
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
        word_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'sign_word',
            key: 'word_id'
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
        tableName: 'word_wrong',
        timestamps: false
    });

    WordWrong.associate = (models) => {
        WordWrong.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'user_id'
        });

        WordWrong.belongsTo(models.SignWord, {
        foreignKey: 'word_id',
        targetKey: 'word_id'
        });
    };

    return WordWrong;
};