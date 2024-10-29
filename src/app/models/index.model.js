const { sequelize } = require('./../../configs/database'); // Giả sử bạn đã thiết lập Sequelize
const bank = require('./bank.model');
const currency = require('./currency.model');
const exchangeRate = require('./exchangeRate.model');

// Liên kết giữa các bảng
bank.hasMany(exchangeRate, { foreignKey: 'bank_id' });
currency.hasMany(exchangeRate, { foreignKey: 'currency_id' });
exchangeRate.belongsTo(bank, { foreignKey: 'bank_id' });
exchangeRate.belongsTo(currency, { foreignKey: 'currency_id' });


// Xuất ra tất cả các models
module.exports = {
  sequelize,
  bank,
  currency,
  exchangeRate,
};
