'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserGroups', {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserGroups');
  }
};
