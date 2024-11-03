const { scrapeSite, scheduleScraping } = require('./../helpers/crawl');
const { crawlBank, getAllBankData, getBankById } = require('../dao/bank.dao');
const { crawlCurrency } = require('./../dao/currency.dao');
const fetchBankData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scheduleScraping(site, crawlBank));
  return await Promise.all(scrapingPromises);
};

const findAllBank = async () =>{
  return await getAllBankData();
}

const findBankById = async (id) => {
  return await getBankById(id);
}
module.exports = {
  fetchBankData,
  findAllBank,
  findBankById
}