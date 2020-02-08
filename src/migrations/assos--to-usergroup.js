'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'UserGroups',
        'UserId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }
    ).then(() => {
        return queryInterface.addColumn(
            'UserGroups',
            'GroupId',
            {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Groups',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
    });
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
        'UserGroups',
        'UserId'
    ).then(() => {
        return queryInterface.removeColumn(
            'UserGroups',
            'GroupId'
        );
    });
  }
};
