const Sequelize = require('sequelize');
const { Bank, Currency } = require('./../app/models/index.model');

const search = async (query) => {
  if (!query) {
    return [];
  }

  const newQuery = query.toLowerCase().trim();

  // Tìm kiếm trong bảng Bank
  const bankResults = await Bank.findAll({
    where: {
      [Sequelize.Op.or]: [
        {
          name: {
            [Sequelize.Op.like]: `%${newQuery}%`
          }
        },
        {
          fullname: {
            [Sequelize.Op.like]: `%${newQuery}%`
          }
        }
      ]
    }
  });

  // Tìm kiếm trong bảng Currency
  const currencyResults = await Currency.findAll({
    where: {
      [Sequelize.Op.or]: [
        {
          code: {
            [Sequelize.Op.like]: `%${newQuery}%`
          }
        },
        {
          name: {
            [Sequelize.Op.like]: `%${newQuery}%`
          }
        }
      ]
    },
  });

  // Kết hợp và định dạng kết quả
  const results = [
    ...bankResults.map(bank => ({
      type: 'Bank',
      id: bank.id,
      name: bank.name,
      fullname: bank.fullname
    })),
    ...currencyResults.map(currency => ({
      type: 'Currency',
      id: currency.id,
      code: currency.code,
      name: currency.name,
    }))
  ];

  return results;
}


module.exports = {
  search,
};