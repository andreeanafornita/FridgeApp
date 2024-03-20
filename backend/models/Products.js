module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('Products', {
    id_product: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name_product: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    base64CodIamgeProduct: {
      type: DataTypes.STRING(900000),
      allowNull: true
    },
    base_quantity_product: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    base_calories_product: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    base_glucides_product: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    base_lipides_product: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    base_proteins_product: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'Products',
    timestamps: false
  });

  Products.associate = models => {
    // One-to-Many relationship with ProductsXUser
    Products.hasMany(models.ProductsXUser, {
      foreignKey: 'productsID_product',
      as: 'ProductsXUser'
    });

    // One-to-Many relationship with MealsXProducts
    Products.hasMany(models.MealsXProducts, {
      foreignKey: 'productsID_meals',
      as: 'MealsXProducts'
    });

    // One-to-Many relationship with DessertsXProducts
    Products.hasMany(models.DessertsXProducts, {
      foreignKey: 'productsID_desserts',
      as: 'DessertsXProducts'
    });
    Products.hasMany(models.PreviousDates, {
      foreignKey: 'idProduct_date', // Cheia străină din tabela PreviousDates care se referă la id-ul produsului din tabela Products
  });
  };

  return Products;
};
