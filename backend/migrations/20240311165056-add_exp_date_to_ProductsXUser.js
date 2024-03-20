'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ProductsXUser', 'exp_dateUser', {
      type: Sequelize.DATE,
      allowNull: true, // sau false, în funcție de necesități
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ProductsXUser', 'exp_dateUser');
  }
};
