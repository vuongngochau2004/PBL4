const { searchData } = require('../../../services/search.service');
const { findBanksFromExchangeRates } = require('../../../services/bank.service');
const { findAllCurrencyLimit3 } = require('../../../services/currency.service');
const { findExchangeRateVietcombank, dateUpdateVietcombank } = require('../../../services/exchangeRate.service');
const { editUser } = require('../../../services/user.service');

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
    const banks = await findBanksFromExchangeRates();
    const currencies = await findAllCurrencyLimit3();
    res.render("pages/profile", {
      banks,
      currencies,
      pageTitle: "Trang cá nhân"
    });
  },
  postProfile: async (req, res) => {
    const body = req.body;
    if(req.file){
      body.image = req.file.filename;
    }else {
      body.image = req.user.image;
    }
    const user = await editUser(req.user.id, body);
    res.redirect("/profile");
  }
}