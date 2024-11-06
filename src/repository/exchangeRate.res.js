const { scrapeSite, scheduleScraping } = require('./../helpers/crawl');
const { crawlVietcombankData,
   getExchangeRateByBankId, 
   getExchangeRateCurrencyByBankId,
   getExchangeRateBankByCurrencyId
   } = require('./../dao/exchangeRate.dao');
const fetchExchangeRateData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scheduleScraping(site, (exchangeRate) =>{
    if(site.name == "Vietcombank"){
      crawlVietcombankData(exchangeRate);
    }
    
  }));
  return await Promise.all(scrapingPromises);
};

const findExchangeRateByBankId = async (id) => {
  return await getExchangeRateByBankId(id);
}
const findExchangeRateCurrencyByBankId = async (id) => {
  return await getExchangeRateCurrencyByBankId(id);
}
const findExchangeRateBankByCurrencyId = async (id) => {
  return await getExchangeRateBankByCurrencyId(id);
}
module.exports = {
  fetchExchangeRateData,
  findExchangeRateByBankId,
  findExchangeRateCurrencyByBankId,
  findExchangeRateBankByCurrencyId
}