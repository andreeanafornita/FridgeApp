module.exports = (sequelize, DataTypes) => {
    const PreviousDates = sequelize.define('PreviousDates', {
      id_date: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idUser_date: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        references: {
          model: 'User', // numele tabelului din baza de date
          key: 'id_user', // cheia primară către care facem referință
        }
      },
      idProduct_date: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        references: {
          model: 'Products', // numele tabelului din baza de date
          key: 'id_product', // cheia primară către care facem referință
        }
      },
      date_expirationProduct: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      date_timeDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Inițializează câmpul cu data și ora curentă
      }
    }, {
      tableName: 'PreviousDates',
      timestamps: false
    });
  
    PreviousDates.associate = (models) => {
        // Definirea asocierii cu modelul User
        PreviousDates.belongsTo(models.User, {
          foreignKey: 'idUser_date', // Cheia străină care se referă la id-ul utilizatorului în modelul PreviousDates
       
        });
        PreviousDates.belongsTo(models.Products, {
          foreignKey: 'idProduct_date', // Cheia străină care se referă la id-ul produsului în modelul PreviousDates
      });
      };
    
  
    return PreviousDates;
  };
  