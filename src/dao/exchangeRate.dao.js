const { Bank, Currency, ExchangeRate } = require('../app/models/index.model');

const crawlVietcombankData = async (exchangeData) => {
  for(const row of exchangeData){
    const [currencyCode, currencyNameEng, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw] = row;
    const vietcomCurrency = await Currency.findOne({
      where: {
        code: currencyCode
      }
    })
    const vietcomBank = await Bank.findOne({
      where: {
        name: 'Vietcombank'
      }
    })
    const cleanedBuyCashPrice = buyCashPriceRaw.includes(',') ? buyCashPriceRaw.replace(/,/g, '.') : '0.' + buyCashPriceRaw;
    const cleanedBuyTransferPriceRaw = buyTransferPriceRaw.includes(',') ? buyTransferPriceRaw.replace(/,/g, '.') : '0.' + buyTransferPriceRaw;
    const cleanedSellCashPriceRaw = sellCashPriceRaw.includes(',') ? sellCashPriceRaw.replace(/,/g, '.') : '0.' + sellCashPriceRaw;

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);

    if(isNaN(buyCashPrice) || buyCashPrice === 0){
      buyCashPrice = null;
    }else if(isNaN(buyTransferPrice) || buyTransferPrice === 0){
      buyTransferPrice = null;
    }else if(isNaN(sellCashPrice) || sellCashPrice === 0){
      sellCashPrice = null;
    }
    const exchangeRate = await ExchangeRate.create({
      bank_id: vietcomBank.id,
      currency_id: vietcomCurrency.id,
      buy_cash_price: buyCashPrice,
      buy_transfer_price: buyTransferPrice,
      sell_cash_price: sellCashPrice,
      sell_transfer_price: null,
    });
    if (exchangeRate != null) {
      console.log('Created successfully!');
    }
  }
}

const crawlMBbankData = async (exchangeData) => {
  
}

const getExchangeRateCurrencyByBankId = async(id) => {
  return await ExchangeRate.findAll({
    where: {
      bank_id: id
    },
    include: [{
      model: Currency,
      attributes: ['name', 'code'],
    }],
  })
  .then(result => {
    return result;  // Trả về trực tiếp vì result đã là một mảng các đối tượng thuần
  })
  .catch(error => {
    console.error(error);
    return [];  // Trả về mảng rỗng nếu có lỗi xảy ra
  });
}

const getExchangeRateBankByCurrencyId = async(id) => {
  return await ExchangeRate.findAll({
    where: {
      currency_id: id
    },
    include: [{
      model: Bank,
      attributes: ['name', 'fullname'],
    }],
  })
  .then(result => {
    return result;  // Trả về trực tiếp vì result đã là một mảng các đối tượng thuần
  })
  .catch(error => {
    console.error(error);
    return [];  // Trả về mảng rỗng nếu có lỗi xảy ra
  });
}

const getExchangeRateByBankId = async (id) => {
  return await ExchangeRate.findAll({
    bank_id: id
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
  crawlVietcombankData,
  getExchangeRateByBankId,
  getExchangeRateCurrencyByBankId,
  getExchangeRateBankByCurrencyId
}