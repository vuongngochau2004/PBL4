const { fetchBankData, findAllBank } = require('../../repository/bank.res');
const { fetchCurrencyData, findAllCurrency } = require('../../repository/currency.res');
const { fetchExchangeRateData } = require('../../repository/exchangeRate.res');


module.exports = {
  getData: async (req, res) => {
    res.send("HomePage");
  }
}