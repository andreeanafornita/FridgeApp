module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id_user: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    budget: {
      type: DataTypes.FLOAT,
      allowNull: true // Presupunem că bugetul poate fi null
    }
  }, {
    tableName: 'User',
    timestamps: false
  });

  User.associate = models => {
    // One-to-Many relationship with ProductsXUser
    User.hasMany(models.ProductsXUser, {
      foreignKey: 'userID_user',
    });

    // One-to-Many relationship with Journal
    User.hasMany(models.Review, {
      foreignKey: 'userID_review',
    });

    // One-to-Many relationship with YourTargets
    User.hasMany(models.YourTargets, {
      foreignKey: 'userIDTargets',
    });
    User.hasMany(models.PreviousSearches, {
      foreignKey: 'idUser_search',
      as: 'searches' // Alias pentru a accesa căutările anterioare ale userului
    });
    User.hasMany(models.PreviousDates, {
      foreignKey: 'idUser_date', // Cheia străină din tabela PreviousDates care se referă la id-ul utilizatorului din tabela User
  });
  User.hasMany(models.Suggestions, {
    foreignKey: 'userId_suggestion',
    as: 'Suggestions'
  });
  };

  return User;
};
