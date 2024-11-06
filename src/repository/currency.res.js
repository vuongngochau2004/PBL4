const { scheduleScraping } = require('./../helpers/crawl');
const { crawlCurrency, getAllCurrencyData, getCurrencyByCode, createCurrency } = require('./../dao/currency.dao');
const fetchCurrencyData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scheduleScraping(site, crawlCurrency));
  return await Promise.all(scrapingPromises);
};

const findAllCurrency = async () => {
  return await getAllCurrencyData();
}

const findAllCurrencyLimit3 = async () =>{
  const currencies = await getAllCurrencyData();
  for (let i = 0; i < currencies.length; i++) {
    for (let j = i+1; j < currencies.length; j++) {
      if(currencies[i].code.slice(0, 3) ===  currencies[j].code.slice(0, 3)){
        currencies.splice(j, 1); // Xóa phần tử currencies[j]
        j--; // Giảm j để không bỏ qua phần tử tiếp theo sau khi xóa
      }
    }
  }
  return currencies;
}

const findCurrencyByCode = async (code) => {
  return await getCurrencyByCode(code);
}

const addCurrency = async (currencies) => {
  return await createCurrency(currencies);
}
module.exports = {
  fetchCurrencyData,
  findAllCurrency,
  findCurrencyByCode,
  addCurrency,
  findAllCurrencyLimit3
}