const currencyModel = require('../app/models/currency.model');
const crawlCurrency = async (exchangeData) => {
  for (const row of exchangeData) {
    if(row.length == 5 ){
      const [ currencyName, currencySymbol, currencyCode, minValue, numberBasic ] = row;
      await currencyModel.findOrCreate({
        where: { code: currencyCode },
        defaults: {
          code: currencyCode,
          name: currencyName,
        },
      });
    }else{
      const [ country, currencyName, currencySymbol, currencyCode, minValue, numberBasic ] = row;
      await currencyModel.findOrCreate({
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
  return await currencyModel.findAll({
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

module.exports = {  
  crawlCurrency,
  getAllCurrencyData
}