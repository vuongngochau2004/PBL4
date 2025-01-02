const { sequelize } = require('../../configs/database'); // Giả sử bạn đã thiết lập Sequelize
const Bank = require('./bank.model');
const Currency = require('./currency.model');
const ExchangeRate = require('./exchangeRate.model');
const User = require('./user.model');

// Liên kết giữa các bảng
Bank.hasMany(ExchangeRate, { foreignKey: 'bank_id' });
Currency.hasMany(ExchangeRate, { foreignKey: 'currency_id' });
ExchangeRate.belongsTo(Bank, { foreignKey: 'bank_id' });
ExchangeRate.belongsTo(Currency, { foreignKey: 'currency_id' }); 

// Xuất ra tất cả các models
module.exports = {
  sequelize,
  Bank,
  Currency,
  ExchangeRate,
  User
};
