const { findBankById, findBanksFromExchangeRates } = require('../../../services/bank.service');
const { findAllCurrencyLimit3 } = require('../../../services/currency.service');
const { findExchangeRateCurrencyByBankId, 
  findExchangeRateCurrencyByBankIdAndDate,
  findExchangeRateVietcombank, 
  dateUpdateVietcombank,
  dateExchangeRateByBankId,
  preDate,
  nextDate,
  preDateFormat,
  nextDateFormat,
  datesOfWeekPre,
  getExchangeRateByBankIdAndDateAndCurrency,
} = require('../../../services/exchangeRate.service');

module.exports = {
  getDataByBankId: async (req,res) =>{
    const query = req.query.date;
    if(!query){
      const id = req.params.id;
      const bank = await findBankById(id);
      const banks = await findBanksFromExchangeRates();
      const currencies = await findAllCurrencyLimit3();
      const exchangeRate = await findExchangeRateCurrencyByBankId(id);
      const exchangeRateVietcombank = await findExchangeRateVietcombank();
      const dateUpdate = await dateUpdateVietcombank();
      const dateExchangeRate = await dateExchangeRateByBankId(id);
      res.render('pages/exchange-rate', {
        bank,
        exchangeRates: exchangeRate,
        banks,
        currencies,
        exchangeRateVietcombank,
        dateUpdate,
        dateExchangeRate,
        pageTitle: "Tỷ giá ngân hàng Việt Nam - Tỷ giá ngoại tệ Việt Nam"
      })
    }else{
      const id = req.params.id;
      const bank = await findBankById(id);
      const banks = await findBanksFromExchangeRates();
      const currencies = await findAllCurrencyLimit3();
      let exchangeRate = [];
      const exchangeRateVietcombank = await findExchangeRateVietcombank();
      const dateUpdate = await dateUpdateVietcombank();
      const action = req.query.action;
      let dateExchangeRate;
      if(action === 'pre'){
        const date = preDate(query);
        exchangeRate = await findExchangeRateCurrencyByBankIdAndDate(id, date);
        dateExchangeRate = preDateFormat(date);
      }if(action === 'next'){
        const date = nextDate(query);
        exchangeRate = await findExchangeRateCurrencyByBankIdAndDate(id, date);
        dateExchangeRate = nextDateFormat(date);
      }
      res.render('pages/exchange-rate', {
        bank,
        exchangeRates: exchangeRate,
        banks,
        currencies,
        exchangeRateVietcombank,
        dateUpdate,
        dateExchangeRate,
        pageTitle: "Tỷ giá ngân hàng Việt Nam - Tỷ giá ngoại tệ Việt Nam"
      })
    }
    
  },
  getChartByBankId: async (req,res) =>{
    const id = req.params.id;
    const date = req.query.date;
    const currency1 = req.query.currency1;
    const currency2 = req.query.currency2;
    console.log(currency1, currency2);
    if(!currency1 && !currency2){
      const bank = await findBankById(id);
      // header
      const banks = await findBanksFromExchangeRates();
      const currencies = await findAllCurrencyLimit3();
      const exchangeRate = await findExchangeRateCurrencyByBankId(id);
    
      //vietcombank
      const exchangeRateVietcombank = await findExchangeRateVietcombank();
      const dateUpdate = await dateUpdateVietcombank();
  
      const dates = datesOfWeekPre(date);
      const data = await getExchangeRateByBankIdAndDateAndCurrency(id, dates, ['USD' , 'EUR']);
      res.render('pages/chart', {
        dateExchange: date,
        data,
        bank,
        exchangeRates: exchangeRate,
        banks,
        currencies,
        exchangeRateVietcombank,
        dateUpdate,
        pageTitle: "Biểu đồ tỷ giá ngân hàng Việt Nam - Tỷ giá ngoại tệ Việt Nam"
      })
    }else{
      let curCode = [];
      if(currency1) curCode.push(currency1);
      if(currency2) curCode.push(currency2);
      const dates = datesOfWeekPre(date);
      const data = await getExchangeRateByBankIdAndDateAndCurrency(id, dates, curCode);
      console.log(data);
      res.json({
        data
      });
    }
    
  }
}