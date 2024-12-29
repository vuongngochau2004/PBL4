const { DataTypes } = require('sequelize');
const { sequelize } = require('./../../configs/database'); 
const bank = require('./bank.model');
const currency = require('./currency.model');

const exchangeRate = sequelize.define('exchangeRate', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bank_id: {
    type: DataTypes.INTEGER,
    references: {
      model: bank,
      key: 'id',
    },
  },
  currency_id: {
    type: DataTypes.INTEGER,
    references: {
      model: currency,
      key: 'id',
    },
  },
  buy_cash_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  buy_transfer_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  sell_cash_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  sell_transfer_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},{
  timestamps: true,
  underscored: true
});

module.exports = exchangeRate;
