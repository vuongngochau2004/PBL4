const { findAllBank } = require('../../../services/bank.service');
const { findAllCurrency, findCurrencyByCode, findAllCurrencyLimit3 } = require('../../../services/currency.service');
const { findExchangeRateBankByCurrencyId } = require('../../../services/exchangeRate.service');
module.exports = {
  getData: async (req,res) =>{
    const curCode = req.params.cur;
    const currency = await findCurrencyByCode(curCode);
    const banks = await findAllBank();
    const currencies = await findAllCurrencyLimit3();
    const exchangeRateBank = await findExchangeRateBankByCurrencyId(curCode); 
    res.render("pages/currency", {
      currency: currency,
      banks: banks,
      currencies: currencies,
      exchangeRateBanks: exchangeRateBank,
      pageTitle: "Exchange Rate - " + curCode
    });
  }
}