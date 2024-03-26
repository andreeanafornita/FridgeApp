module.exports = (sequelize, DataTypes) => {
  const DessertsXProducts = sequelize.define('DessertsXProducts', {
    id_dessertsXproducts: { // Adăugăm această linie
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    productsID_desserts: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id_product',
      },
      primaryKey: true
    },
    dessertsID_dessert: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Desserts',
        key: 'id_dessert',
      },
      primaryKey: true
    },
    quantity_product: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    quantity_calories_product: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    quantity_glucides_product: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    quantity_lipides_product: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    quantity_proteins_product: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    units_required_dessert: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'DessertsXProducts',
    timestamps: false
  });

  DessertsXProducts.associate = models => {
    // Many-to-One relationship with Desserts
    DessertsXProducts.belongsTo(models.Desserts, {
      foreignKey: 'dessertsID_dessert',
      as: 'Desserts'
    });

    // Many-to-One relationship with Products
    DessertsXProducts.belongsTo(models.Products, {
      foreignKey: 'productsID_desserts',
      as: 'Products'
    });
  };

  return DessertsXProducts;
};
