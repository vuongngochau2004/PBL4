const { scrapeSite, scheduleScraping, scheduleScrapingExchangeRate } = require('../helpers/crawl');
const { 
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
} = require('../dao/exchangeRate.dao');
const { formatNumber, formatDateTime, formatMoneyOther } = require('../helpers/utils');

const fetchExchangeRateData = async (sitesConfig) => {
  for (const site of sitesConfig) {
    await scheduleScrapingExchangeRate(site, async (exchangeRate) => {
      if (site.name == "Vietcombank") {
        await crawlVietcombankData(exchangeRate);
      }
      if (site.name == "MB Bank") {
        await crawlMBbankData(exchangeRate);
      }
      if (site.name == "Agribank") {
        await crawlAgribankData(exchangeRate);
      }
      if(site.name == "BIDV"){
        await crawlBIDVData(exchangeRate);
      }
      if(site.name == "VP Bank"){
        await crawlVPbankData(exchangeRate);
      }
      if(site.name == "Techcombank"){
        await crawlTechcombankData(exchangeRate);
      }
      if(site.name == "BaoVietBank"){
        await crawlBaoVietBankData(exchangeRate);
      }
      if (site.name == "HD Bank") {
        await crawlHDBankData(exchangeRate);
      }
      if (site.name == "HSBC") {
        await crawlHSBCData(exchangeRate);
      }
      if (site.name == "VIB") {
        await crawlVIBData(exchangeRate);
      }
      if(site.name == "TPBank"){
        await crawlTPBankData(exchangeRate);
      }
    });
  }
};

const fetchExchangeRateDataTest = async (sitesConfig) => {
  for (const site of sitesConfig) {
    await scrapeSite(site, async (exchangeRate) => {
      
    });
  }
};

const findExchangeRateByBankId = async (id) => {
  const exchangeRates = await getExchangeRateByBankId(id);
  for(const row of exchangeRates){
    row.buy_cash_price = formatNumber(row.buy_cash_price);
    row.buy_transfer_price = formatNumber(row.buy_transfer_price);
    row.sell_cash_price = formatNumber(row.sell_cash_price);
    row.sell_transfer_price = formatNumber(row.sell_transfer_price);
    row.currency.code_lowercase = row.currency.code.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D').replace(/đ/g, 'd').replace(/\s+/g, '').toLowerCase();
    row.createdAt = formatDateTime(row.createdAt);
  }
  return exchangeRates;
}

const findExchangeRateCurrencyByBankId = async (id) => {
  const exchangeRates = await getExchangeRateCurrencyByBankId(id);
  for(const row of exchangeRates){
    row.buy_cash_price = formatNumber(row.buy_cash_price);
    row.buy_transfer_price = formatNumber(row.buy_transfer_price);
    row.sell_cash_price = formatNumber(row.sell_cash_price);
    row.sell_transfer_price = formatNumber(row.sell_transfer_price);
    row.currency.code_lowercase = row.currency.code.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D').replace(/đ/g, 'd').replace(/\s+/g, '').toLowerCase().slice(0, 3);
    row.createdAt = formatDateTime(row.createdAt);
  }
  return exchangeRates;
}

const findExchangeRateBankByCurrencyId = async (curCode) => {
  const exchangeRates = await getExchangeRateBankByCurrencyId(curCode);
  for (let i = 0; i < exchangeRates.length; i++) {
    for (let j = i+1; j < exchangeRates.length; j++) {
      if(exchangeRates[i].bank.name ===  exchangeRates[j].bank.name){
        exchangeRates.splice(j, 1); // Xóa phần tử exchangeRates[j]
        j--; // Giảm j để không bỏ qua phần tử tiếp theo sau khi xóa
      }
    }
  }
  for(const row of exchangeRates){
    row.buy_cash_price = formatNumber(row.buy_cash_price);
    row.buy_transfer_price = formatNumber(row.buy_transfer_price);
    row.sell_cash_price = formatNumber(row.sell_cash_price);
    row.sell_transfer_price = formatNumber(row.sell_transfer_price);
    row.bank.name_lowercase = row.bank.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D').replace(/đ/g, 'd').replace(/\s+/g, '').toLowerCase();
    row.createdAt = formatDateTime(row.createdAt);
  }
  return exchangeRates;
}

const findExchangeRateVietcombank = async () => {
  const exchangeRates = await getExchangeRateVietcombank();
  for(const row of exchangeRates){
    row.buy_cash_price = formatNumber(row.buy_cash_price);
    row.buy_transfer_price = formatNumber(row.buy_transfer_price);
    row.sell_cash_price = formatNumber(row.sell_cash_price);
    row.sell_transfer_price = formatNumber(row.sell_transfer_price);
    row.createdAt = formatDateTime(row.createdAt);
  }
  return exchangeRates;
}

const dateUpdateVietcombank = async () => {
  const exchangeRates = await getExchangeRateVietcombank();
  return formatDateTime(exchangeRates[0].createdAt);
}

const getAverageAllRates = async (curCode) => {
  let totalSum = 0;
  let totalCount = 0;

  const bankRates = await findExchangeRateBankByCurrencyId(curCode);

  Object.values(bankRates).forEach(bank => {
    const buy_cash_price = formatMoneyOther(bank.buy_cash_price);
    const buy_transfer_price = formatMoneyOther(bank.buy_transfer_price);
    const sell_cash_price = formatMoneyOther(bank.sell_cash_price);
    const sell_transfer_price = formatMoneyOther(bank.sell_transfer_price);
    if(parseFloat(buy_cash_price) > 0) {
      totalSum += parseFloat(buy_cash_price);
      totalCount++;
    }else if(parseFloat(buy_transfer_price) > 0){
      totalSum += parseFloat(buy_transfer_price);
      totalCount++;
    }else if(parseFloat(sell_cash_price) > 0){
      totalSum += parseFloat(sell_cash_price);
      totalCount++;
    }else if(parseFloat(sell_transfer_price) > 0){
      totalSum += parseFloat(sell_transfer_price);
      totalCount++;
    }
  });
  console.log(totalSum, totalCount);

  return totalCount > 0 ? parseFloat((totalSum / totalCount).toFixed(3)) : 0;
}

const convertUSDtoVND = async (usdAmount, curCode) => {
  const averageRate = await getAverageAllRates(curCode);
  return {
    usdAmount,
    vndAmount: usdAmount * averageRate,
    averageRate
  };
}

module.exports = {
  fetchExchangeRateData,
  findExchangeRateByBankId,
  findExchangeRateCurrencyByBankId,
  findExchangeRateBankByCurrencyId,
  fetchExchangeRateDataTest,
  findExchangeRateVietcombank,
  dateUpdateVietcombank,
  convertUSDtoVND,
}