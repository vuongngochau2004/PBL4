const { findBankById, findAllBankToLowerCase } = require('../../../services/bank.service');
const { findAllCurrencyLimit3 } = require('../../../services/currency.service');
const { findExchangeRateCurrencyByBankId, findExchangeRateVietcombank, dateUpdateVietcombank } = require('../../../services/exchangeRate.service');

module.exports = {
  getData: async (req, res) => {
    const banks = await findAllBankToLowerCase();
    const currencies = await findAllCurrencyLimit3();
    const exchangeRateVietcombank = await findExchangeRateVietcombank();
    const dateUpdate = await dateUpdateVietcombank();
    res.render("pages/bank", {
      banks,
      currencies,
      exchangeRateVietcombank,
      dateUpdate,
      pageTitle: "Tỷ giá ngân hàng tại Việt Nam - Tỷ giá ngoại tệ Việt Nam"
    });
  },
  getDataByBankId: async (req,res) =>{
    const id = req.params.id;
    const bank = await findBankById(id);
    const banks = await findAllBankToLowerCase();
    const currencies = await findAllCurrencyLimit3();
    const exchangeRate = await findExchangeRateCurrencyByBankId(id);
    const exchangeRateVietcombank = await findExchangeRateVietcombank();
    const dateUpdate = await dateUpdateVietcombank();
    res.render('pages/exchange-rate', {
      bank,
      exchangeRates: exchangeRate,
      banks,
      currencies,
      exchangeRateVietcombank,
      dateUpdate,
      pageTitle: "Tỷ giá ngân hàng Việt Nam - Tỷ giá ngoại tệ Việt Nam"
    })
  }
}