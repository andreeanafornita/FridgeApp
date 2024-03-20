module.exports = (sequelize, DataTypes) => {
    const PreviousSearches = sequelize.define('PreviousSearches', {
      id_search: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idUser_search: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        references: {
          model: 'User', // numele tabelului din baza de date
          key: 'id_user', // cheia primară către care facem referință
        }
      },
      keyword_search: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date_timeSearch: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Inițializează câmpul cu data și ora curentă
      }
    }, {
      tableName: 'PreviousSearches',
      timestamps: false
    });
  
    PreviousSearches.associate = models => {
      // Legătura Many to One către User
      PreviousSearches.belongsTo(models.User, {
        foreignKey: 'idUser_search',
        as: 'User'
      });
    };
  
    return PreviousSearches;
  };
  