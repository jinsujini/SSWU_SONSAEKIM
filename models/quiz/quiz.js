module.exports = (sequelize, DataTypes) => {
const Quiz = sequelize.define('Quiz', {
    id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
    },
    option1: {
    type: DataTypes.STRING(100),
    allowNull: false
    },
    option2: {
    type: DataTypes.STRING(100),
    allowNull: false
    },
    option3: {
    type: DataTypes.STRING(100),
    allowNull: false
    },
    option4: {
    type: DataTypes.STRING(100),
    allowNull: false
    },
    answer: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
        min: 1,
        max: 4
    }
    },
    source_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
        model: 'sign_word', 
        key: 'word_id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
    }
}, {
    tableName: 'quiz',
    timestamps: false
});

Quiz.associate = (models) => {
    Quiz.belongsTo(models.SignWord, {
    foreignKey: 'source_id',
    targetKey: 'word_id'
    });
};

return Quiz;
};