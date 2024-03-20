module.exports = (sequelize, DataTypes) => {
    const ProductsXUser = sequelize.define('ProductsXUser', {
      // Nu este specificată o cheie primară explicită aici,
      // presupunând că nu există o coloană de ID în tabelul de asociere.
      userID_user: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        references: {
          model: 'User', // Numele modelului Sequelize pentru tabelul 'User'
          key: 'id_user' // Numele coloanei cheie primare din tabelul 'User'
        }
      },
      productsID_product: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        references: {
          model: 'Products', // Numele modelului Sequelize pentru tabelul 'Products'
          key: 'id_product' // Numele coloanei cheie primare din tabelul 'Products'
        }
      },
      units: {
        type: DataTypes.INTEGER(10),
        allowNull: false
      },
      exp_dateUser:{
        type: DataTypes.DATE,
        allowNull:true
      },
      

    }, {
      tableName: 'ProductsXUser',
      timestamps: false,
      // Dacă tabelul nu are o cheie primară explicită,
      // Sequelize necesită setarea `freezeTableName` pe true
      // și dezactivarea `id` implicit prin `id: false`
      freezeTableName: true,
      id: false
    });
  
    ProductsXUser.associate = models => {
      ProductsXUser.belongsTo(models.User, {
        foreignKey: 'userID_user',
        as: 'User'
      });
  
      ProductsXUser.belongsTo(models.Products, {
        foreignKey: 'productsID_product',
        as: 'Product'
      });
    };
  
    return ProductsXUser;
  };
  