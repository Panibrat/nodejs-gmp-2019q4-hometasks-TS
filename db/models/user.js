'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login: {
        allowNull: false,
        type: DataTypes.STRING
    },
    password: DataTypes.STRING,
    age: DataTypes.INTEGER,
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};