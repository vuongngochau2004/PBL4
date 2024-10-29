const { scrapeSite, scheduleScraping } = require('./../helpers/crawl');
const { crawlBank, getAllBankData } = require('../dao/bank.dao');
const { crawlCurrency } = require('./../dao/currency.dao');
const fetchBankData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scheduleScraping(site, crawlBank));
  return await Promise.all(scrapingPromises);
};

const findAllBank = async () =>{
  return await getAllBankData();
}

module.exports = {
  fetchBankData,
  findAllBank
}