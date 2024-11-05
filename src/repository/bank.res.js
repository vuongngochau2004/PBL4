const { scrapeSite, scheduleScraping } = require('./../helpers/crawl');
const { crawlBank, getAllBankData, getBankById } = require('../dao/bank.dao');
const { crawlCurrency } = require('./../dao/currency.dao');
const fetchBankData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scrapeSite(site, crawlBank));
  return await Promise.all(scrapingPromises);
};
function formatDate(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}
const findAllBank = async () =>{
  const banks = await getAllBankData();
  for(const row of banks){
    row.last_updated = formatDate(row.last_updated);
  }
  return banks;
}

const findBankById = async (id) => {
  return await getBankById(id);
}
module.exports = {
  fetchBankData,
  findAllBank,
  findBankById
}