const { fetchBankData, findAllBank, findBankById } = require('../../../services/bank.service');
const { fetchCurrencyData, findAllCurrency, addCurrency } = require('../../../services/currency.service');
const { fetchExchangeRateData, findExchangeRateCurrencyByBankId } = require('../../../services/exchangeRate.service');

module.exports = {
  getData: async (req, res) => {
    const banks = await findAllBank();
    const currencies = await findAllCurrency();
    res.render("pages/bank", {
      banks: banks,
      currencies: currencies,
      pageTitle: "Exchange Rate"
    });
  },
  getDataByBankId: async (req,res) =>{
    const id = req.params.id;
    const bank = await findBankById(id);
    const banks = await findAllBank();
    const currencies = await findAllCurrency();
    const exchangeRate = await findExchangeRateCurrencyByBankId(id);
    res.render('pages/exchange-rate', {
      bank: bank,
      exchangeRates: exchangeRate,
      banks: banks,
      currencies: currencies,
      pageTitle: "Exchange Rate"
    })
  }
}