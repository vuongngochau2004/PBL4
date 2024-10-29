const { DataTypes } = require('sequelize');
const {sequelize} = require('./../../configs/database'); // Giả sử bạn đã thiết lập Sequelize

const currency = sequelize.define('currency', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true
});

module.exports = currency;
