const { scrapeSite } = require('./../helpers/crawl');
const { crawlVietcombankData } = require('./../dao/exchangeRate.dao');
const fetchExchangeRateData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scrapeSite(site, (exchangeRate) =>{
    if(site.name == "Vietcombank"){
      crawlVietcombankData(exchangeRate);
    }
  }));
  return await Promise.all(scrapingPromises);
};

module.exports = {
  fetchExchangeRateData,
}