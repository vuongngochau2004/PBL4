const { searchData } = require('./../../../services/search.service');
const { findBanksFromExchangeRates } = require('./../../../services/bank.service');
const { findAllCurrencyLimit3 } = require('./../../../services/currency.service');
const { findExchangeRateVietcombank, dateUpdateVietcombank } = require('./../../../services/exchangeRate.service');

module.exports = {
  getData: async (req, res) => {
    const banks = await findBanksFromExchangeRates();
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
  searchData: async (req, res) => {
    const query = req.query.q;
    const results = await searchData(query);
    res.json(results);
  }, 
  getProfile: async (req, res) => {
    console.log('ok');
    res.render("pages/profile", {
      pageTitle: "Trang cá nhân",
    });
  },
}