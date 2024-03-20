module.exports = (sequelize, DataTypes) => {
  const AllTargets = sequelize.define('AllTargets', {
    id_target: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    descriptionTarget: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    isHardTarget: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'AllTargets',
    timestamps: false
  });

  AllTargets.associate = models => {
    // One-to-Many relationship with YourTargets through the primary key id_target and foreign key allTargetsID_your
    AllTargets.hasMany(models.YourTargets, {
      foreignKey: 'allTargetsID_your',
      as: 'YourTargets'
    });

  
  };

  return AllTargets;
};
