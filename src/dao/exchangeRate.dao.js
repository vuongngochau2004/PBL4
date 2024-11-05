const { where } = require('sequelize');
const exchangeRateModel = require('../app/models/exchangeRate.model');
const bankModel = require('./../app/models/bank.model');
const currencyModel = require('./../app/models/currency.model');
const currency = require('./../app/models/currency.model');
const exchangeRate = require('../app/models/exchangeRate.model');
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
    const cleanedBuyCashPrice = buyCashPriceRaw.includes(',') ? buyCashPriceRaw.replace(/,/g, '') :  buyCashPriceRaw;
    const cleanedBuyTransferPriceRaw = buyTransferPriceRaw.includes(',') ? buyTransferPriceRaw.replace(/,/g, '') : buyTransferPriceRaw;
    const cleanedSellCashPriceRaw = sellCashPriceRaw.includes(',') ? sellCashPriceRaw.replace(/,/g, '') :  sellCashPriceRaw;

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    console.log(sellCashPrice);
    if(isNaN(buyCashPrice)){
      buyCashPrice = null;
    }
     if(isNaN(buyTransferPrice)){
      buyTransferPrice = null;
    }
     if(isNaN(sellCashPrice)){
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
  // xu li du lieu
  for(const row of exchangeData){    //buyTransferPriceRaw buyCashPriceRaw
    const [currencyCode, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw, sellTransferPriceRaw] = row;
    if(currencyCode == 'USD (USD 50-100)' || currencyCode == 'USD (Dưới 5 USD)' || currencyCode == 'USD (USD 5 - 20)'){
      continue;
    }
    
    // tim trong bang bank va currency 
    // tra ve doi tuong co currencyCode trong bang bank
    const mbCurrency = await currencyModel.findOne({
      where: {
        code: currencyCode
      }
    });
    const mbBank = await bankModel.findOne({
      where: {
        name : 'MB'
      }
    });
    // xử lí dữ liệu 
    const cleanedBuyCashPrice = buyCashPriceRaw.includes(',') ? buyCashPriceRaw.replace(/\,/g, "") : buyCashPriceRaw;
    const cleanedBuyTransferPriceRaw = buyTransferPriceRaw.includes(',') ? buyTransferPriceRaw.replace(/,/g, '') : buyTransferPriceRaw;
    const cleanedSellTransferPriceRaw = sellTransferPriceRaw.includes(',') ? sellTransferPriceRaw.replace(/,/g, '') : sellTransferPriceRaw;
    const cleanedSellCashPriceRaw = sellCashPriceRaw.includes(',') ? sellCashPriceRaw.replace(/,/g, '') : sellCashPriceRaw;
    // console.log(cleanedBuyCashPrice + '\n');
    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    var sellTransferPrice = parseFloat(cleanedSellTransferPriceRaw);

    
    if(isNaN(buyCashPriceRaw)){
      buyCashPrice = null;
    } 
     if(isNaN(buyTransferPriceRaw)){
      buyTransferPrice = null;
    } 
     if(isNaN(sellCashPriceRaw)) {
      sellCashPrice = null;
    } 
     if(isNaN(sellTransferPriceRaw)){
      sellTransferPrice = null;
    }
    // const existingExchangeRate = await exchangeRateModel.findOne({
    //   where: {
    //     bank_id: mbBank.id,
    //     currency_id : mbCurrency.id
    //   }
    // });
    const existingExchangeRate = await exchangeRateModel.findOne({
      where: {
        bank_id: mbBank.id,
        currency_id: mbCurrency.id
      }
    });
    if(existingExchangeRate) {
      // neu co ton tai thi update ban ghi;
      await exchangeRateModel.update({
        buy_cash_price : buyCashPrice,
        buy_transfer_price : buyTransferPrice,
        sell_cash_price: sellCashPrice,
        sell_transfer_price : sellTransferPrice
      },
      {
        where: {
          bank_id: mbBank.id,
          currency_id: mbCurrency.id
        }
      }
    );
      console.log('Updated mbbank successfully!');
    }
    else {
      const exchangeRate = exchangeRateModel.create({
        bank_id: mbBank.id,
        currency_id: mbCurrency.id,
        buy_cash_price : buyCashPrice,
        buy_transfer_price : buyTransferPrice,
        sell_cash_price: sellCashPrice,
        sell_transfer_price : sellTransferPrice
      });
      if(exchangeRate != null){
        console.log('Created mb bank successfully');
      }
    }
  }
}
const crawlVietinbankData = async (exchangeData) =>{
  // for(const row of exchangeData){
  //   console.log(row);
  // }
}
const  crawlAgribankData = async (exchangeData) =>{
  for(const row of exchangeData){
    const [currencyCode, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw] = row;
    const agribankCurrency = await currencyModel.findOne({ 
      where: {
        code: currencyCode
      }
    })
    const agribankBank = await bankModel.findOne({
      where: {
        name: 'Agribank'
      }
    })
    const cleanedBuyCashPrice = buyCashPriceRaw.includes(',') ? buyCashPriceRaw.replace(/,/g, '') :  buyCashPriceRaw;
    const cleanedBuyTransferPriceRaw = buyTransferPriceRaw.includes(',') ? buyTransferPriceRaw.replace(/,/g, '') : buyTransferPriceRaw;
    const cleanedSellCashPriceRaw = sellCashPriceRaw.includes(',') ? sellCashPriceRaw.replace(/,/g, '') :  sellCashPriceRaw;

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    console.log(sellCashPrice);
    if(isNaN(buyCashPrice)){
      buyCashPrice = null;
    }
     if(isNaN(buyTransferPrice)){
      buyTransferPrice = null;
    }
     if(isNaN(sellCashPrice)){
      sellCashPrice = null;
    }
    // Kiểm tra sự tồn tại của bản ghi
    const existingExchangeRate = await exchangeRateModel.findOne({
      where: {
        bank_id: agribankBank.id,
        currency_id: agribankCurrency.id
      }
    });

    if (existingExchangeRate) {
      // Nếu bản ghi đã tồn tại, cập nhật bản ghi
      await existingExchangeRate.update({
        buy_cash_price: buyCashPrice,
        buy_transfer_price: buyTransferPrice,
        sell_cash_price: sellCashPrice,
      }
    );
      console.log('Updated successfully!');
    } else {
      // Nếu bản ghi chưa tồn tại, tạo mới
      const exchangeRate = await exchangeRateModel.create({
        bank_id: agribankBank.id,
        currency_id: agribankCurrency.id,
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
const crawlBIDVData = async (exchangeData) =>{
  for(const row of exchangeData){
    
    
    const [currencyCode, currencyNameEng, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw] = row;
    // them doan xu li usd
    
    if(currencyCode == "XAU"){
      continue;
    }
    const bidvCurrency = await currencyModel.findOne({ 
      where: {
        code: currencyCode
      }
    })
    const bidvBank = await bankModel.findOne({
      where: {
        name: 'BIDV'
      }
    })
    const cleanedBuyCashPrice = buyCashPriceRaw.includes(',') ? buyCashPriceRaw.replace(/,/g, '') :  buyCashPriceRaw;
    const cleanedBuyTransferPriceRaw = buyTransferPriceRaw.includes(',') ? buyTransferPriceRaw.replace(/,/g, '') : buyTransferPriceRaw;
    const cleanedSellCashPriceRaw = sellCashPriceRaw.includes(',') ? sellCashPriceRaw.replace(/,/g, '') :  sellCashPriceRaw;

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    console.log(sellCashPrice);
    if(isNaN(buyCashPrice)){
      buyCashPrice = null;
    }
     if(isNaN(buyTransferPrice)){
      buyTransferPrice = null;
    }
     if(isNaN(sellCashPrice)){
      sellCashPrice = null;
    }
    // Kiểm tra sự tồn tại của bản ghi
    const existingExchangeRate = await exchangeRateModel.findOne({
      where: {
        bank_id: bidvBank.id,
        currency_id: bidvCurrency.id
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
        bank_id: bidvBank.id,
        currency_id: bidvCurrency.id,
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
module.exports = {  
  crawlVietcombankData,
  crawlMBbankData,
  crawlVietinbankData,
  crawlAgribankData,
  crawlBIDVData
}