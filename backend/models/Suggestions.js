module.exports = (sequelize, DataTypes) => {
    const Suggestions = sequelize.define('Suggestions', {
        id_suggestion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        suggestionText: {
            type: DataTypes.TEXT, // TEXT pentru sugestii mai lungi
            allowNull: false
        },
        userId_suggestion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User', // Numele tabelului din baza de date
                key: 'id_user' // Cheia primară a modelului User cu care se face asociația
            }
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'pending' // Starea implicită a unei sugestii noi
        }
    }, {
        tableName: 'Suggestions',
        timestamps: true // Activează timpii de creare și modificare
    });

    Suggestions.associate = models => {
        Suggestions.belongsTo(models.User, {
            foreignKey: 'userId_suggestion',
            as: 'User'
        });
        // Asociațiile suplimentare vin aici
    };

    return Suggestions;
};
