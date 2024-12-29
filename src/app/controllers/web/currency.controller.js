const { findAllBank, findAllBankToLowerCase } = require('../../../services/bank.service');
const { findCurrencyByCode, findAllCurrencyLimit3 } = require('../../../services/currency.service');
const { findExchangeRateBankByCurrencyId, findExchangeRateVietcombank, dateUpdateVietcombank, convertUSDtoVND} = require('../../../services/exchangeRate.service');
module.exports = {
  getData: async (req,res) =>{
    const curCode = req.params.cur;
    const currency = await findCurrencyByCode(curCode);
    const banks = await findAllBankToLowerCase();
    const currencies = await findAllCurrencyLimit3();
    const exchangeRateBank = await findExchangeRateBankByCurrencyId(curCode); 
    const exchangeRateVietcombank = await findExchangeRateVietcombank();
    const money = await convertUSDtoVND(1, curCode);
    console.log(money);
    const dateUpdate = await dateUpdateVietcombank();
    res.render("pages/currency", {
      currency,
      banks,
      currencies,
      exchangeRateBanks: exchangeRateBank,
      exchangeRateVietcombank,
      dateUpdate,
      pageTitle: "Tỷ giá ngân hàng - " + curCode
    });
  }
}