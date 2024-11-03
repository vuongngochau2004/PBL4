const e = require('express');
const { Currency } = require('../app/models/index.model');

const crawlCurrency = async (exchangeData) => {
  for (const row of exchangeData) {
    if(row.length == 5 ){
      const [ currencyName, currencySymbol, currencyCode, minValue, numberBasic ] = row;
      await Currency.findOrCreate({
        where: { code: currencyCode },
        defaults: {
          code: currencyCode,
          name: currencyName,
        },
      });
    }else{
      const [ country, currencyName, currencySymbol, currencyCode, minValue, numberBasic ] = row;
      await Currency.findOrCreate({
        where: { code: currencyCode },
        defaults: {
          code: currencyCode,
          name: currencyName,
        },
      });
    }
  }
}

const getAllCurrencyData = async () =>{
  return await Currency.findAll({
    raw: true  // Trả về các đối tượng thuần túy thay vì instance của Sequelize
  })
  .then(result => {
    return result;  // Trả về trực tiếp vì result đã là một mảng các đối tượng thuần
  })
  .catch(error => {
    console.error(error);
    return [];  // Trả về mảng rỗng nếu có lỗi xảy ra
  });
} 

const getCurrencyByCode = async (code) => {
  return await Currency.findOne({
    where:{
      code: code
    }
  })
  .then(result => {
    return result;
  })
  .catch(error => {
    console.log(error);
  })
}

module.exports = {  
  crawlCurrency,
  getAllCurrencyData,
  getCurrencyByCode
}