const { scheduleScraping } = require('./../helpers/crawl');
const { crawlCurrency, getAllCurrencyData, getCurrencyByCode } = require('./../dao/currency.dao');
const fetchCurrencyData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scheduleScraping(site, crawlCurrency));
  return await Promise.all(scrapingPromises);
};

const findAllCurrency = async () => {
  return await getAllCurrencyData();
}

const findCurrencyByCode = async (code) => {
  return await getCurrencyByCode(code);
}
module.exports = {
  fetchCurrencyData,
  findAllCurrency,
  findCurrencyByCode
}