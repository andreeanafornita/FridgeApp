module.exports = (sequelize, DataTypes) => {
  const YourTargets = sequelize.define('YourTargets', {
    id_yourTargets:{
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    allTargetsID_your: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'AllTargets',
        key: 'id_target'
      },
      unique: false
    },
    userIDTargets: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'User',
        key: 'id_user'
      },
      unique: false
      
    }
    // alte coloane, dacă există
  }, {
    tableName: 'YourTargets',
    timestamps: false,
    freezeTableName: true
  });

  YourTargets.associate = models => {
    // Relația Many-To-One cu User
    YourTargets.belongsTo(models.User, {
      foreignKey: 'userIDTargets'
      
    });

    // Relația Many-To-One cu AllTargets
    YourTargets.belongsTo(models.AllTargets, {
      foreignKey: 'allTargetsID_your',
      as: 'AllTarget'
    });

   
  };

  return YourTargets;
};
