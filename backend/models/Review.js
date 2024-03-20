module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id_review: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    descriptionReview: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    userID_review: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'User',
        key: 'id_user'
      }
    },
    dessertID_review: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Desserts',
        key: 'id_dessert'
      }
    },
    mealID_review: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Meals',
        key: 'id_meal'
      }
    }
  }, {
    tableName: 'Review',
    timestamps: false
  });

  Review.associate = models => {
    // Relația Many-To-One cu User
    Review.belongsTo(models.User, {
      foreignKey: 'userID_review',
    });

    // Relația Many-To-One cu Desserts
    Review.belongsTo(models.Desserts, {
      foreignKey: 'dessertID_review',
    });

    // Relația Many-To-One cu Meals
    Review.belongsTo(models.Meals, {
      foreignKey: 'mealID_review',
    });
  };

  return Review;
};
