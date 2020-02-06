'use strict';
const groups = require('../db/groups.json');

module.exports = {
    up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Groups', groups, {});
},

down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Groups', null, {});
}
};
