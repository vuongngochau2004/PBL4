const { findBankById, findAllBankToLowerCase } = require('../../../services/bank.service');
const { findAllCurrencyLimit3 } = require('../../../services/currency.service');
const { findExchangeRateCurrencyByBankId } = require('../../../services/exchangeRate.service');

module.exports = {
  getData: async (req, res) => {
    const banks = await findAllBankToLowerCase();
    const currencies = await findAllCurrencyLimit3();
    res.render("pages/bank", {
      banks: banks,
      currencies: currencies,
      pageTitle: "Tỷ giá ngân hàng tại Việt Nam - Tỷ giá ngoại tệ Việt Nam"
    });
  },
  getDataByBankId: async (req,res) =>{
    const id = req.params.id;
    const bank = await findBankById(id);
    const banks = await findAllBankToLowerCase();
    const currencies = await findAllCurrencyLimit3();
    const exchangeRate = await findExchangeRateCurrencyByBankId(id);
    res.render('pages/exchange-rate', {
      bank: bank,
      exchangeRates: exchangeRate,
      banks: banks,
      currencies: currencies,
      pageTitle: "Tỷ giá ngân hàng Việt Nam - Tỷ giá ngoại tệ Việt Nam"
    })
  }
}