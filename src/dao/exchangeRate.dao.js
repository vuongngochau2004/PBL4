const { Bank, Currency, ExchangeRate } = require('../app/models/index.model');
const { Op, Sequelize } = require('sequelize');
const { formatMoney, formatMoneyOther } = require('../helpers/utils.helper');

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
    const cleanedBuyCashPrice = formatMoney(buyCashPriceRaw);
    const cleanedBuyTransferPriceRaw = formatMoney(buyTransferPriceRaw);
    const cleanedSellCashPriceRaw = formatMoney(sellCashPriceRaw);

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
    await ExchangeRate.create({
      bank_id: vietcomBank.id,
      currency_id: vietcomCurrency.id,
      buy_cash_price: buyCashPrice,
      buy_transfer_price: buyTransferPrice,
      sell_cash_price: sellCashPrice,
      sell_transfer_price: null,
    });
  }
  console.log('Đã crawl xong dữ liệu từ Vietcombank');
}

const crawlMBbankData = async (exchangeData) => {
  // xu li du lieu
  for(const row of exchangeData){  
    const [currencyCode, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw, sellTransferPriceRaw] = row;
    if(currencyCode.length > 3){
      const check = await Currency.findOne({
        where:{
          code: currencyCode,
        }
      })
      if(!check){
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
    const cleanedBuyCashPrice = formatMoney(buyCashPriceRaw);
    const cleanedBuyTransferPriceRaw = formatMoney(buyTransferPriceRaw);
    const cleanedSellCashPriceRaw = formatMoney(sellCashPriceRaw);
    const cleanedSellTransferPriceRaw = formatMoney(sellTransferPriceRaw);

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
    // tao moi 
    ExchangeRate.create({
      bank_id: mbBank.id,
      currency_id: mbCurrency.id,
      buy_cash_price : buyCashPrice,
      buy_transfer_price : buyTransferPrice,
      sell_cash_price: sellCashPrice,
      sell_transfer_price : sellTransferPrice
    });
  }
  console.log('Đã crawl xong dữ liệu từ MB');
}

const crawlAgribankData = async (exchangeData) =>{
  for(const row of exchangeData){
    const [currencyCode, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw] = row;
    if(currencyCode.length > 3){
      const check = await Currency.findOne({
        where:{
          code: currencyCode,
        }
      })
      if(!check){
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
    const cleanedBuyCashPrice = formatMoney(buyCashPriceRaw);
    const cleanedBuyTransferPriceRaw = formatMoney(buyTransferPriceRaw);
    const cleanedSellCashPriceRaw = formatMoney(sellCashPriceRaw);

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
    await ExchangeRate.create({
      bank_id: agribankBank.id,
      currency_id: agribankCurrency.id,
      buy_cash_price: buyCashPrice,
      buy_transfer_price: buyTransferPrice,
      sell_cash_price: sellCashPrice,
    });
  }
  console.log('Đã crawl xong dữ liệu từ Agribank');
}

const crawlBIDVData = async (exchangeData) =>{
  for(const row of exchangeData){
    const [currencyCode, currencyNameEng, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw] = row;
    if(currencyCode.length > 3){
      const check = await Currency.findOne({
        where:{
          code: currencyCode,
        }
      })
      if(!check){
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
    const cleanedBuyCashPrice = formatMoney(buyCashPriceRaw);
    const cleanedBuyTransferPriceRaw = formatMoney(buyTransferPriceRaw);
    const cleanedSellCashPriceRaw = formatMoney(sellCashPriceRaw);

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
    await ExchangeRate.create({
      bank_id: bidvBank.id,
      currency_id: bidvCurrency.id,
      buy_cash_price: buyCashPrice,
      buy_transfer_price: buyTransferPrice,
      sell_cash_price: sellCashPrice,
    });
  }
  console.log('Đã crawl xong dữ liệu từ BIDV');
}

const crawlVPbankData = async (exchangeData) =>{
  for(const row of exchangeData){
    const [currencyCode, currencyName, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw, sellTransferRaw] = row;
    if(currencyCode.length > 3){
      const check = await Currency.findOne({
        where:{
          code: currencyCode,
        }
      })
      if(!check){
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
    const vpbankCurrency = await Currency.findOne({ 
      where: {
        code: currencyCode
      }
    })
    const vpbankBank = await Bank.findOne({
      where: {
        name: 'VPBank'
      }
    })
    const cleanedBuyCashPrice = formatMoney(buyCashPriceRaw);
    const cleanedBuyTransferPriceRaw = formatMoney(buyTransferPriceRaw);
    const cleanedSellCashPriceRaw = formatMoney(sellCashPriceRaw);
    const cleanedSellTransferPriceRaw = formatMoney(sellTransferRaw);

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    var sellTransferPrice = parseFloat(cleanedSellTransferPriceRaw);
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
    if(isNaN(sellTransferPrice) || sellTransferPrice === 0){
      sellTransferPrice = null;
    }
    await ExchangeRate.create({
      bank_id: vpbankBank.id,
      currency_id: vpbankCurrency.id,
      buy_cash_price: buyCashPrice,
      buy_transfer_price: buyTransferPrice,
      sell_cash_price: sellCashPrice,
      sell_transfer_price: sellTransferPrice,
    });
  }
  console.log('Đã crawl xong dữ liệu từ VPBank');
}

const crawlTechcombankData = async (exchangeData) =>{
  for(const row of exchangeData){
    const [currencyCode, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw, sellTransferRaw] = row;
    if(currencyCode.length > 3){
      const check = await Currency.findOne({
        where:{
          code: currencyCode,
        }
      })
      if(!check){
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
    const techcomCurrency = await Currency.findOne({ 
      where: {
        code: currencyCode
      }
    })
    const techcomBank = await Bank.findOne({
      where: {
        name: 'Techcombank'
      }
    })
    const cleanedBuyCashPrice = formatMoney(buyCashPriceRaw);
    const cleanedBuyTransferPriceRaw = formatMoney(buyTransferPriceRaw);
    const cleanedSellCashPriceRaw = formatMoney(sellCashPriceRaw);
    const cleanedSellTransferPriceRaw = formatMoney(sellTransferRaw);

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    var sellTransferPrice = parseFloat(cleanedSellTransferPriceRaw);
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
    if(isNaN(sellTransferPrice) || sellTransferPrice === 0){
      sellTransferPrice = null;
    }
    await ExchangeRate.create({
      bank_id: techcomBank.id,
      currency_id: techcomCurrency.id,
      buy_cash_price: buyCashPrice,
      buy_transfer_price: buyTransferPrice,
      sell_cash_price: sellCashPrice,
      sell_transfer_price: sellTransferPrice,
    });
  }
  console.log('Đã crawl xong dữ liệu từ Techcombank');
}

const crawlBaoVietBankData = async (exchangeData) =>{
  for(const row of exchangeData){
    const [currencyName, currencyCode, buyCashPriceRaw, buyTransferPriceRaw, sellTransferPriceRaw] = row;
    if(currencyCode.length > 3){
      const check = await Currency.findOne({
        where:{
          code: currencyCode,
        }
      })
      if(!check){
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
    const baovietCurrency = await Currency.findOne({ 
      where: {
        code: currencyCode
      }
    })
    const baovietBank = await Bank.findOne({
      where: {
        name: 'Bảo Việt'
      }
    })
    const buyCashPriceRawOrther = buyCashPriceRaw.length > 6 ? buyCashPriceRaw.slice(0, 6) :  buyCashPriceRaw;
    const cleanedBuyCashPrice = formatMoney(buyCashPriceRawOrther);
    const cleanedBuyTransferPriceRaw = formatMoney(buyTransferPriceRaw);
    const cleanedSellTransferPriceRaw = formatMoney(sellTransferPriceRaw);

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellTransferPrice = parseFloat(cleanedSellTransferPriceRaw);
    console.log(buyCashPrice);

    if(isNaN(buyCashPrice) || buyCashPrice === 0){
      buyCashPrice = null;
    }
    if(isNaN(buyTransferPrice) || buyTransferPrice === 0){
      buyTransferPrice = null;
    }
    if(isNaN(sellTransferPrice) || sellTransferPrice === 0){
      sellTransferPrice = null;
    }
    await ExchangeRate.create({
      bank_id: baovietBank.id,
      currency_id: baovietCurrency.id,
      buy_cash_price: buyCashPrice,
      buy_transfer_price: buyTransferPrice,
      sell_transfer_price: sellTransferPrice,
    });
  }
  console.log('Đã crawl xong dữ liệu từ Bảo Việt');
}

const crawlHDBankData = async (exchangeData) =>{
  for(const row of exchangeData){
    const [currencyCode, buyCashPriceRaw, buyTransferPriceRaw, sellTransferPriceRaw, sellCashPriceRaw] = row;
    if(currencyCode.slice(0, 3) === 'SJC'){
      continue;
    }
    if(currencyCode.length > 3){
      const check = await Currency.findOne({
        where:{
          code: currencyCode,
        }
      })
      if(!check){
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
    const hdbankCurrency = await Currency.findOne({ 
      where: {
        code: currencyCode
      }
    })
    const hdbankBank = await Bank.findOne({
      where: {
        name: 'HDBank'
      }
    })
    const cleanedBuyCashPrice = formatMoney(buyCashPriceRaw);
    const cleanedBuyTransferPriceRaw = formatMoney(buyTransferPriceRaw);
    const cleanedSellCashPriceRaw = formatMoney(sellCashPriceRaw);
    const cleanedSellTransferPriceRaw = formatMoney(sellTransferPriceRaw);

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    var sellTransferPrice = parseFloat(cleanedSellTransferPriceRaw);
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
    if(isNaN(sellTransferPrice) || sellTransferPrice === 0){
      sellTransferPrice = null;
    }
    await ExchangeRate.create({
      bank_id: hdbankBank.id,
      currency_id: hdbankCurrency.id,
      buy_cash_price: buyCashPrice,
      buy_transfer_price: buyTransferPrice,
      sell_cash_price: sellCashPrice,
      sell_transfer_price: sellTransferPrice,
    });
  }
  console.log('Đã crawl xong dữ liệu từ HDBank');
}

const crawlHSBCData = async (exchangeData) => {
  for(const row of exchangeData){   
    const [currencyCodeOld, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw, sellTransferPriceRaw] = row;
    const start = currencyCodeOld.indexOf('(') + 1;
    const end = currencyCodeOld.indexOf(')');
    const currencyCode  = currencyCodeOld.slice(start, end);
    const hsbcCurrency  = await Currency.findOne({
        where:{
          code: currencyCode,
        }
    });
    const hsbcBank = await Bank.findOne({
      where: {
        name: 'HSBC',
      }
    });
    const cleanedBuyCashPrice = buyCashPriceRaw.includes(',') ? buyCashPriceRaw.replace(/,/g, '') : buyCashPriceRaw;
    const cleanedBuyTransferPriceRaw = buyTransferPriceRaw.includes(',') ? buyTransferPriceRaw.replace(/,/g, '') : buyTransferPriceRaw;
    const cleanedSellCashPriceRaw = sellCashPriceRaw.includes(',') ? sellCashPriceRaw.replace(/,/g, '') : sellCashPriceRaw;
    const cleanedSellTransferPriceRaw = sellCashPriceRaw.includes(',') ? sellCashPriceRaw.replace(/,/g, '') : sellTransferPriceRaw;

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    var sellTransferPrice = parseFloat(cleanedSellTransferPriceRaw);
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
    if(isNaN(sellTransferPrice) || sellTransferPrice === 0){
      sellTransferPrice = null;
    }

    // tao moi 
    ExchangeRate.create({
      bank_id: hsbcBank.id,
      currency_id: hsbcCurrency.id,
      buy_cash_price : buyCashPrice,
      buy_transfer_price : buyTransferPrice,
      sell_cash_price: sellCashPrice,
      sell_transfer_price : sellTransferPrice
    });
  }
  console.log('Đã crawl xong dữ liệu từ HSBC');
}

const crawlVIBData = async (exchangeData) => {
  for(const row of exchangeData){  
    const [currencyCode, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw, sellTransferPriceRaw] = row;
    if(!currencyCode){
      continue;
    }
    const vibCurrency  = await Currency.findOne({
        where:{
          code: currencyCode,
        }
    });
    const vibBank = await Bank.findOne({
      where: {
        name: 'VIB',
      }
    });
    
    const cleanedBuyCashPrice = formatMoneyOther(buyCashPriceRaw);
    const cleanedBuyTransferPriceRaw = formatMoneyOther(buyTransferPriceRaw);
    const cleanedSellCashPriceRaw = formatMoneyOther(sellCashPriceRaw);
    const cleanedSellTransferPriceRaw = formatMoneyOther(sellTransferPriceRaw);
    
    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    var sellTransferPrice = parseFloat(cleanedSellTransferPriceRaw);
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
    if(isNaN(sellTransferPrice) || sellTransferPrice === 0){
      sellTransferPrice = null;
    }
    // tao moi 
    await ExchangeRate.create({
      bank_id: vibBank.id,
      currency_id: vibCurrency.id,
      buy_cash_price : buyCashPrice,
      buy_transfer_price : buyTransferPrice,
      sell_cash_price: sellCashPrice,
      sell_transfer_price : sellTransferPrice
    });
  }
  console.log('Đã crawl xong dữ liệu từ VIB');
}

const crawlTPBankData = async (exchangeData) => {
  for(const row of exchangeData){
    const [currencyCode, currencyName, buyCashPriceRaw, buyTransferPriceRaw, sellCashPriceRaw, sellTransferPriceRaw] = row;
    const checkCurrency = await Currency.findOne({
      where: {
        code: currencyCode,
      }
    });
    if(!checkCurrency){
      await Currency.create({
        code: currencyCode,
        name: currencyName,
      })
    }
    const tpCurrency = await Currency.findOne({
      where: {
        code: currencyCode
      }
    });
    const tpBank = await Bank.findOne({
      where: {
        name: 'TPB'
      }
    });

    const cleanedBuyCashPrice = formatMoney(buyCashPriceRaw);
    const cleanedBuyTransferPriceRaw = formatMoney(buyTransferPriceRaw);
    const cleanedSellCashPriceRaw = formatMoney(sellCashPriceRaw);
    const cleanedSellTransferPriceRaw = formatMoney(sellTransferPriceRaw);

    var buyCashPrice = parseFloat(cleanedBuyCashPrice);
    var buyTransferPrice = parseFloat(cleanedBuyTransferPriceRaw);
    var sellCashPrice = parseFloat(cleanedSellCashPriceRaw);
    var sellTransferPrice = parseFloat(cleanedSellTransferPriceRaw);
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
    if(isNaN(sellTransferPrice) || sellTransferPrice === 0){
      sellTransferPrice = null;
    }

    await ExchangeRate.create({
      bank_id: tpBank.id,
      currency_id: tpCurrency.id,
      buy_cash_price: buyCashPrice,
      buy_transfer_price: buyTransferPrice,
      sell_cash_price: sellCashPrice,
      sell_transfer_price: sellTransferPrice,
    });
  }
  console.log('Đã crawl xong dữ liệu từ TPBank');
}

const getExchangeRateCurrencyByBankId = async (bankId) => {
  try {
    // Lấy thời gian mới nhất của từng currency_id cho bank_id cụ thể
    const latestRecords = await ExchangeRate.findAll({
      attributes: [
        'currency_id',
        [Sequelize.fn('MAX', Sequelize.col('created_at')), 'latest_created_at'],
      ],
      where: {
        bank_id: bankId, // Lọc theo bank_id
      },
      group: ['currency_id'], // Nhóm theo currency_id
      raw: true, // Lấy dữ liệu thô
    });

    // Lấy các bản ghi chi tiết dựa trên thời gian mới nhất
    const detailedRecords = await ExchangeRate.findAll({
      where: {
        [Op.or]: latestRecords.map(record => ({
          bank_id: bankId, // Đảm bảo đúng bank_id
          currency_id: record.currency_id,
          created_at: record.latest_created_at, // Khớp với thời gian mới nhất
        })),
      },
      include: [{
        model: Currency,
        attributes: ['name', 'code'],
      }],
    });

    return detailedRecords;
  } catch (error) {
    console.error(error);
    return []; // Trả về mảng rỗng nếu có lỗi xảy ra
  }
};

const getExchangeRateCurrencyByBankIdAndDate = async (bankId, date) => {
  try {
    // Lấy thời gian đầu ngày và cuối ngày từ date ISO
    const startOfDay = new Date(date).setUTCHours(0, 0, 0, 0); // Đầu ngày UTC
    const endOfDay = new Date(date).setUTCHours(23, 59, 59, 999); // Cuối ngày UTC

    // Lấy thời gian trễ nhất của từng currency_id cho bank_id và ngày cụ thể
    const latestRecords = await ExchangeRate.findAll({
      attributes: [
        'currency_id',
        [Sequelize.fn('MAX', Sequelize.col('created_at')), 'latest_created_at'], // Lấy thời gian trễ nhất
      ],
      where: {
        bank_id: bankId, // Lọc theo bank_id
        created_at: {
          [Op.between]: [startOfDay, endOfDay], // So sánh trong khoảng thời gian ngày
        },
      },
      group: ['currency_id'], // Nhóm theo currency_id
      raw: true, // Trả về dữ liệu thô
    });

    // Lấy các bản ghi chi tiết dựa trên thời gian trễ nhất
    const detailedRecords = await ExchangeRate.findAll({
      where: {
        [Op.or]: latestRecords.map(record => ({
          bank_id: bankId, // Đảm bảo đúng bank_id
          currency_id: record.currency_id, // Đúng currency_id
          created_at: record.latest_created_at, // Thời gian trễ nhất
        })),
      },
      include: [
        {
          model: Currency, // Bao gồm thông tin từ Currency
          attributes: ['name', 'code'], // Chỉ lấy các trường cần thiết
        },
      ],
    });

    return detailedRecords;
  } catch (error) {
    console.error('Lỗi khi lấy exchangeRates:', error);
    return []; // Trả về mảng rỗng nếu có lỗi xảy ra
  }
};

const getExchangeRateCurrencyByBankIdAndDateAndCurrencyCode = async (bankId, date, currencyCode) => {
  try {
    // Lấy thời gian đầu ngày và cuối ngày từ date ISO
    const startOfDay = new Date(date).setUTCHours(0, 0, 0, 0); // Đầu ngày UTC
    const endOfDay = new Date(date).setUTCHours(23, 59, 59, 999); // Cuối ngày UTC

    // Tìm currency_id dựa trên currencyCode
    const currency = await Currency.findOne({
      where: { code: currencyCode },
      attributes: ['id'],
      raw: true, // Trả về dữ liệu thô
    });

    if (!currency) {
      throw new Error(`Currency với mã ${currencyCode} không tồn tại.`);
    }

    // Lấy thời gian trễ nhất của currency_id cụ thể cho bank_id và ngày cụ thể
    const latestRecord = await ExchangeRate.findOne({
      attributes: [
        [Sequelize.fn('MAX', Sequelize.col('created_at')), 'latest_created_at'], // Lấy thời gian trễ nhất
      ],
      where: {
        bank_id: bankId, // Lọc theo bank_id
        currency_id: currency.id, // Lọc theo currency_id
        created_at: {
          [Op.between]: [startOfDay, endOfDay], // So sánh trong khoảng thời gian ngày
        },
      },
      raw: true, // Trả về dữ liệu thô
    });

    if (!latestRecord.latest_created_at) {
      return null; // Không tìm thấy bản ghi nào
    }

    // Lấy bản ghi chi tiết dựa trên thời gian trễ nhất
    const detailedRecord = await ExchangeRate.findOne({
      where: {
        bank_id: bankId, // Đảm bảo đúng bank_id
        currency_id: currency.id, // Đúng currency_id
        created_at: latestRecord.latest_created_at, // Thời gian trễ nhất
      },
      include: [
        {
          model: Currency, // Bao gồm thông tin từ Currency
          attributes: ['name', 'code'], // Chỉ lấy các trường cần thiết
        },
      ],
    });

    return detailedRecord;
  } catch (error) {
    console.error('Lỗi khi lấy exchangeRate với bankId, date và currencyCode:', error);
    return null; // Trả về null nếu có lỗi xảy ra
  }
};

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
        currency_id: row.id,
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

const getExchangeRateByBankId =  async (bankId) => {
  try {
    // Lấy thời gian mới nhất của từng currency_id cho bank_id cụ thể
    const latestRecords = await ExchangeRate.findAll({
      attributes: [
        'currency_id',
        [Sequelize.fn('MAX', Sequelize.col('created_at')), 'latest_created_at'],
      ],
      where: {
        bank_id: bankId, // Lọc theo bank_id
      },
      group: ['currency_id'], // Nhóm theo currency_id
      raw: true, // Lấy dữ liệu thô
    });

    // Lấy các bản ghi chi tiết dựa trên thời gian mới nhất
    const detailedRecords = await ExchangeRate.findAll({
      where: {
        [Op.or]: latestRecords.map(record => ({
          bank_id: bankId, // Đảm bảo đúng bank_id
          currency_id: record.currency_id,
          created_at: record.latest_created_at, // Khớp với thời gian mới nhất
        })),
      },
    });

    return detailedRecords;
  } catch (error) {
    console.error(error);
    return []; // Trả về mảng rỗng nếu có lỗi xảy ra
  }
};

const getExchangeRateVietcombank = async () => {
  const vietcomBank = await Bank.findOne({
    where: {
      name: 'Vietcombank'
    }
  });
  try {
    // Lấy thời gian mới nhất của từng currency_id cho bank_id cụ thể
    const latestRecords = await ExchangeRate.findAll({
      attributes: [
        'currency_id',
        [Sequelize.fn('MAX', Sequelize.col('created_at')), 'latest_created_at'],
      ],
      where: {
        bank_id: vietcomBank.id, // Lọc theo bank_id
      },
      group: ['currency_id'], // Nhóm theo currency_id
      raw: true, // Lấy dữ liệu thô
    });

    // Lấy các bản ghi chi tiết dựa trên thời gian mới nhất
    const detailedRecords = await ExchangeRate.findAll({
      where: {
        [Op.or]: latestRecords.map(record => ({
          bank_id: vietcomBank.id, // Đảm bảo đúng bank_id
          currency_id: record.currency_id,
          created_at: record.latest_created_at, // Khớp với thời gian mới nhất
        })),
      },
      limit: 5,
      include: [{
        model: Currency,
        attributes: ['name', 'code'],
      }],
    });
    return detailedRecords;
  } catch (error) {
    console.error(error);
    return []; // Trả về mảng rỗng nếu có lỗi xảy ra
  }
}


module.exports = {  
  crawlTPBankData,
  crawlHSBCData,
  crawlHDBankData,
  crawlVIBData,
  crawlBaoVietBankData,
  crawlTechcombankData,
  crawlVPbankData,
  crawlVietcombankData,
  crawlMBbankData,
  crawlAgribankData,
  crawlBIDVData,
  getExchangeRateByBankId,
  getExchangeRateCurrencyByBankId,
  getExchangeRateBankByCurrencyId,
  getExchangeRateVietcombank,
  getExchangeRateCurrencyByBankIdAndDate,
  getExchangeRateCurrencyByBankIdAndDateAndCurrencyCode,
}