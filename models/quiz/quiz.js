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
        source_type: {
        type: DataTypes.ENUM('sign_word', 'sign_vc'),
        allowNull: false
        },
        source_id: {
        type: DataTypes.BIGINT,
        allowNull: false
        }
    }, {
        tableName: 'quiz',
        timestamps: false
    });

    // sign_word만 기본 연결, sign_vc는 동적 처리.. 폴리모픽 연관관계
    Quiz.associate = (models) => {
        Quiz.belongsTo(models.SignWord, {
        foreignKey: 'source_id',
        targetKey: 'word_id',
        constraints: false 
        });
    };

    return Quiz;
};