'use strict';
const usersGroups = require('../db/users-groups.json');

module.exports = {
    up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserGroups', usersGroups, {});
},

down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserGroups', null, {});
}
};
