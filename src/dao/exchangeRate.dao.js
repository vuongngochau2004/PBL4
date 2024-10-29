const exchangeRateModel = require('../app/models/exchangeRate.model');
const bankModel = require('./../app/models/bank.model');
const currencyModel = require('./../app/models/currency.model');
const crawlVietcombankData = async (exchangeData) => {
  for(const row of exchangeData){
    const [currencyCode, currencyNameEng, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw] = row;
    const vietcomCurrency = await currencyModel.findOne({
      where: {
        code: currencyCode
      }
    })
    const vietcomBank = await bankModel.findOne({
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
    
    if(isNaN(buyCashPrice)){
      buyCashPrice = null;
    }else if(isNaN(buyTransferPrice)){
      buyTransferPrice = null;
    }else if(isNaN(sellCashPrice)){
      sellCashPrice = null;
    }
    // Kiểm tra sự tồn tại của bản ghi
    const existingExchangeRate = await exchangeRateModel.findOne({
      where: {
        bank_id: vietcomBank.id,
        currency_id: vietcomCurrency.id
      }
    });

    if (existingExchangeRate) {
      // Nếu bản ghi đã tồn tại, cập nhật bản ghi
      await existingExchangeRate.update({
        buy_cash_price: buyCashPrice,
        buy_transfer_price: buyTransferPrice,
        sell_cash_price: sellCashPrice,
      });
      console.log('Updated successfully!');
    } else {
      // Nếu bản ghi chưa tồn tại, tạo mới
      const exchangeRate = await exchangeRateModel.create({
        bank_id: vietcomBank.id,
        currency_id: vietcomCurrency.id,
        buy_cash_price: buyCashPrice,
        buy_transfer_price: buyTransferPrice,
        sell_cash_price: sellCashPrice,
      });
      if (exchangeRate != null) {
        console.log('Created successfully!');
      }
    }
  }
}

const crawlMBbankData = async (exchangeData) => {
  
}


module.exports = {  
  crawlVietcombankData,
}