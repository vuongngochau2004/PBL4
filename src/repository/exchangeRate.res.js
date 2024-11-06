const { scrapeSite, scheduleScraping, scheduleScrapingExchangeRate } = require('./../helpers/crawl');
const { 
  crawlVietcombankData,
  crawlMBbankData,
  crawlAgribankData,
  crawlBIDVData,
  getExchangeRateByBankId, 
  getExchangeRateCurrencyByBankId,
  getExchangeRateBankByCurrencyId,
} = require('./../dao/exchangeRate.dao');

formatNumber = (number) => {
  if(number == null){
    return number;
  }
  return number.toLocaleString('en-US');
}
const fetchExchangeRateData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scrapeSite(site, (exchangeRate) =>{
    if(site.name == "Vietcombank"){
      crawlVietcombankData(exchangeRate);
    }
    if(site.name == "MB Bank"){
      crawlMBbankData(exchangeRate);
    } 
    if(site.name == "Agribank"){
      crawlAgribankData(exchangeRate);
    }
    if(site.name == "BIDV"){
      crawlBIDVData(exchangeRate);
    }
  }));
  return await Promise.all(scrapingPromises);
};

const findExchangeRateByBankId = async (id) => {
  const exchangeRates = await getExchangeRateByBankId(id);
  for(const row of exchangeRates){
    row.buy_cash_price = formatNumber(row.buy_cash_price);
    row.buy_transfer_price = formatNumber(row.buy_transfer_price);
    row.sell_cash_price = formatNumber(row.sell_cash_price);
    row.sell_transfer_price = formatNumber(row.sell_transfer_price);
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
  }
  return exchangeRates;
}

module.exports = {
  fetchExchangeRateData,
  findExchangeRateByBankId,
  findExchangeRateCurrencyByBankId,
  findExchangeRateBankByCurrencyId
}