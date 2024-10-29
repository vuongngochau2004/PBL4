const { scheduleScraping } = require('./../helpers/crawl');
const { crawlCurrency, getAllCurrencyData } = require('./../dao/currency.dao');
const fetchCurrencyData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scheduleScraping(site, crawlCurrency));
  return await Promise.all(scrapingPromises);
};

const findAllCurrency = async () => {
  return await getAllCurrencyData();
}
module.exports = {
  fetchCurrencyData,
  findAllCurrency
}