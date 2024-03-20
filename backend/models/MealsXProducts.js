module.exports = (sequelize, DataTypes) => {
  const MealsXProducts = sequelize.define('MealsXProducts', {
    productsID_meals: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id_product'
      }
    },
    mealsID_meals: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Meals',
        key: 'id_meal'
      }
    },
    quantity_ingredient: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    quantity_proteins_ingredient: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    quantity_glucides_ingredient: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    quantity_lipides_ingredient: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    quantity_calories_ingredient: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'MealsXProducts',
    timestamps: false,
    freezeTableName: true,
    primaryKey: {
      fields: ['productsID_meals', 'mealsID_meals']
    }
  });

  MealsXProducts.associate = models => {
    // Relația Many-To-One cu Products
    MealsXProducts.belongsTo(models.Products, {
      foreignKey: 'productsID_meals',
      as: 'Product'
    });

    // Relația Many-To-One cu Meals
    MealsXProducts.belongsTo(models.Meals, {
      foreignKey: 'mealsID_meals',
      as: 'Meal'
    });
  };

  return MealsXProducts;
};
