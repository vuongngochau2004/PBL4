const { scrapeSite, scheduleScraping } = require('../helpers/crawl.helper');
const { crawlBank, getAllBankData, getBankById, getBanksFromExchangeRates } = require('../dao/bank.dao');
const { formatDateTime } = require('../helpers/utils.helper');
const fetchBankData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scrapeSite(site, crawlBank));
  return await Promise.all(scrapingPromises);
};

const findAllBank = async () =>{
  const banks = await getAllBankData();
  for(const row of banks){
    row.last_updated = formatDateTime(row.last_updated);
  }
  return banks;
}

const findAllBankToLowerCase = async () =>{
  const banks = await getAllBankData();
  for(const row of banks){
    row.last_updated = formatDateTime(row.last_updated);
    console.log(row.last_updated);
    row.name_lowercase = row.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D').replace(/đ/g, 'd').replace(/\s+/g, '').toLowerCase();
  }
  return banks;
}

const findBankById = async (id) => {
  return await getBankById(id);
}

const findBanksFromExchangeRates = async () => {
  const banks = await getBanksFromExchangeRates();
  for (const row of banks) {
    row.last_updated = formatDateTime(row.last_updated);
    if (row.name) {
      row.name_lowercase = row.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/Đ/g, 'D')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '')
        .toLowerCase();
    } else {
      console.warn('Missing name field:', row);
    }
  }
  return banks;
};

module.exports = {
  fetchBankData,
  findAllBank,
  findBankById,
  findAllBankToLowerCase,
  findBanksFromExchangeRates,
}