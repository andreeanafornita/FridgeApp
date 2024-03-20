module.exports = (sequelize, DataTypes) => {
  const Meals = sequelize.define('Meals', {
    id_meal: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name_meal: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    base64CodImageMeal: {
      type: DataTypes.STRING(900),
      allowNull: true
    },
    quantity_meal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    calories_meal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    glucides_meal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    lipides_meal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    our_rec_meal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    price_meal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    proteins_meal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    prep_mode_meal: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'Meals',
    timestamps: false
  });

  Meals.associate = models => {
    // One-to-Many relationship with MealXProducts
    Meals.hasMany(models.MealsXProducts, {
      foreignKey: 'mealsID_meals',
      as: 'MealXProducts'
    });

    // One-to-Many relationship with Review
    Meals.hasMany(models.Review, {
      foreignKey: 'mealID_review',
      as: 'MealReviews'
    });
  };

  return Meals;
};
