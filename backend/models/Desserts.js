module.exports = (sequelize, DataTypes) => {
  const Desserts = sequelize.define('Desserts', {
    id_dessert: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name_dessert: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    quantity_dessert: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    calories_dessert: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    glucides_dessert: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    lipides_dessert: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    our_rec_dessert: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    base64CodeImageDessert: {
      type: DataTypes.STRING(900),
      allowNull: true
    },
    price_dessert: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    proteins_dessert: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    prep_mode_dessert: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'Desserts',
    timestamps: false
  });

  Desserts.associate = models => {
    // One-to-Many relationship with Review
    Desserts.hasMany(models.Review, {
      foreignKey: 'dessertID_review',
      as: 'DessertReviews'
    });

    // One-to-Many relationship with DessertsXProducts
    Desserts.hasMany(models.DessertsXProducts, {
      foreignKey: 'dessertsID_dessert',
      as: 'DessertsProducts'
    });
  };

  return Desserts;
};
