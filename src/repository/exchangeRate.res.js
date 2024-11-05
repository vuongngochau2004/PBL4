const { scrapeSite } = require('./../helpers/crawl');
const {  crawlMBbankData, crawlVietcombankData } = require('./../dao/exchangeRate.dao');
const fetchExchangeRateData = async (sitesConfig) => {
  const scrapingPromises = sitesConfig.map(site => scrapeSite(site, (exchangeRate) =>{
    if(site.name == "Vietcombank"){
     crawlVietcombankData(exchangeRate);
    }
    if(site.name == "MB Bank"){
      crawlMBbankData(exchangeRate);
    }
  }));
  return await Promise.all(scrapingPromises);
};

module.exports = {
  fetchExchangeRateData,
}