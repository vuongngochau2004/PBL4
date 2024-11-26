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
    const cleanedBuyCashPrice = buyCashPriceRaw.includes(',') ? buyCashPriceRaw.replace(/,/g, '') : buyCashPriceRaw;
    const cleanedBuyTransferPriceRaw = buyTransferPriceRaw.includes(',') ? buyTransferPriceRaw.replace(/,/g, '') : buyTransferPriceRaw;
    const cleanedSellCashPriceRaw = sellCashPriceRaw.includes(',') ? sellCashPriceRaw.replace(/,/g, '') : sellCashPriceRaw;

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);

    if(isNaN(buyCashPrice) || buyCashPrice === 0){
      buyCashPrice = null;
    }
    if(isNaN(buyTransferPrice) || buyTransferPrice === 0){
      buyTransferPrice = null;
    }
    if(isNaN(sellCashPrice) || sellCashPrice === 0){
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
  // xu li du lieu
  for(const row of exchangeData){    //buyTransferPriceRaw buyCashPriceRaw
    const [currencyCode, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw, sellTransferPriceRaw] = row;
    if(currencyCode.length > 3){
      const cur = await Currency.findOne({
        where:{
          code: currencyCode
        }
      })
      if(cur){
        continue;
      }else{
        const code = currencyCode.slice(0, 3);
        const existingCurrency = await Currency.findOne({
          where:{
            code: code,
          }
        })
        if(existingCurrency){
          await Currency.create({
            code: currencyCode,
            name: existingCurrency.name,
          })
        }
      }
    }
    // tim trong bang bank va currency 
    // tra ve doi tuong co currencyCode trong bang bank
    const mbCurrency = await Currency.findOne({
      where: {
        code: currencyCode
      }
    });
    const mbBank = await Bank.findOne({
      where: {
        name : 'MB'
      }
    });
    // xử lí dữ liệu 
    const cleanedBuyCashPrice = buyCashPriceRaw.includes(',') ? buyCashPriceRaw.replace(/,/g, '') : buyCashPriceRaw;
    const cleanedBuyTransferPriceRaw = buyTransferPriceRaw.includes(',') ? buyTransferPriceRaw.replace(/,/g, '') : buyTransferPriceRaw;
    const cleanedSellCashPriceRaw = sellCashPriceRaw.includes(',') ? sellCashPriceRaw.replace(/,/g, '') : sellCashPriceRaw;
    const cleanedSellTransferPriceRaw = sellCashPriceRaw.includes(',') ? sellCashPriceRaw.replace(/,/g, '') : sellTransferPriceRaw;

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    var sellTransferPrice = parseFloat(cleanedSellTransferPriceRaw);

    if(isNaN(buyCashPrice) || buyCashPrice === 0){
      buyCashPrice = null;
    }  
    if(isNaN(buyTransferPrice) || buyTransferPrice === 0){
      buyTransferPrice = null;
    }
    if(isNaN(sellCashPrice) || sellCashPrice === 0) {
      sellCashPrice = null;
    }
    if(isNaN(sellTransferPrice) || sellTransferPrice === 0){
      sellTransferPrice = null;
    }
    console.log(buyTransferPrice);
    const existingExchangeRate = await ExchangeRate.findOne({
      where: {
        bank_id: mbBank.id,
        currency_id: mbCurrency.id
      }
    });
    // tao moi 
    const exchangeRate = ExchangeRate.create({
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

const crawlAgribankData = async (exchangeData) =>{
  for(const row of exchangeData){
    const [currencyCode, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw] = row;
    const agribankCurrency = await Currency.findOne({ 
      where: {
        code: currencyCode
      }
    })
    const agribankBank = await Bank.findOne({
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
    if(isNaN(buyCashPrice) || buyCashPrice === 0){
      buyCashPrice = null;
    }
    if(isNaN(buyTransferPrice) || buyTransferPrice === 0){
      buyTransferPrice = null;
    }
    if(isNaN(sellCashPrice) || sellCashPrice === 0){
      sellCashPrice = null;
    }
    const exchangeRate = await ExchangeRate.create({
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

const crawlBIDVData = async (exchangeData) =>{
  for(const row of exchangeData){
    const [currencyCode, currencyNameEng, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw] = row;
    if(currencyCode.length > 3){
      const cur = await Currency.findOne({
        where:{
          code: currencyCode
        }
      })
      if(cur){
        continue;
      }else{
        const code = currencyCode.slice(0, 3);
        const existingCurrency = await Currency.findOne({
          where:{
            code: code,
          }
        })
        if(existingCurrency){
          await Currency.create({
            code: currencyCode,
            name: existingCurrency.name,
          })
        }
      }
    }
    
    if(currencyCode == "XAU"){
      continue;
    }
    const bidvCurrency = await Currency.findOne({ 
      where: {
        code: currencyCode
      }
    })
    const bidvBank = await Bank.findOne({
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
    if(isNaN(buyCashPrice) || buyCashPrice === 0){
      buyCashPrice = null;
    }  
    if(isNaN(buyTransferPrice) || buyTransferPrice === 0){
      buyTransferPrice = null;
    }
    if(isNaN(sellCashPrice) || sellCashPrice === 0) {
      sellCashPrice = null;
    }
    const exchangeRate = await ExchangeRate.create({
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

const getExchangeRateBankByCurrencyId = async(curCode) => {
  const currencies = await Currency.findAll();
  const curs = [];
  for(const row of currencies){
    if(row.code.slice(0, 3) === curCode){
      // thêm phần tử vào mảng curcodes
      curs.push(row);
    }
  }
  let exchangeRates = [];
  for(const row of curs){
    const rates = await ExchangeRate.findAll({
      where: {
        currency_id: row.id
      },
      include: [{
        model: Bank,
        attributes: ['id', 'name', 'fullname'],
      }],
    })
    .then(result => {
      return result;  // Trả về trực tiếp vì result đã là một mảng các đối tượng thuần
    })
    .catch(error => {
      console.error(error);
      return [];  // Trả về mảng rỗng nếu có lỗi xảy ra
    });
    // Thêm kết quả vào mảng exchangeRates
    exchangeRates = exchangeRates.concat(rates);

  }
  return exchangeRates;
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
  crawlMBbankData,
  crawlAgribankData,
  crawlBIDVData,
  getExchangeRateByBankId,
  getExchangeRateCurrencyByBankId,
  getExchangeRateBankByCurrencyId,
}