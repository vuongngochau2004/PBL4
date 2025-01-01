const { findAllBank, findAllBankToLowerCase } = require('../../../services/bank.service');
const { findCurrencyByCode, findAllCurrencyLimit3 } = require('../../../services/currency.service');
const { 
  findExchangeRateBankByCurrencyId, 
  findExchangeRateVietcombank, 
  dateUpdateVietcombank, 
  convertCurtoVND, 
  getMaxAverageRate, 
  getMinAverageRate,
  getBanksByMaxRates,
  getBanksByMinRates,
  getCurentDate,
 } = require('../../../services/exchangeRate.service');
module.exports = {
  getData: async (req,res) =>{
    const curCode = req.params.cur;
    const currency = await findCurrencyByCode(curCode);
    const banks = await findAllBankToLowerCase();
    const currencies = await findAllCurrencyLimit3();
    const exchangeRateBank = await findExchangeRateBankByCurrencyId(curCode); 
    const exchangeRateVietcombank = await findExchangeRateVietcombank();
    const money = await convertCurtoVND(1, curCode);
    const dateUpdate = await dateUpdateVietcombank();
    const maxRates = await getMaxAverageRate(curCode);
    const minRates = await getMinAverageRate(curCode);
    const banksMaxRates = await getBanksByMaxRates(curCode);
    const banksMinRates = await getBanksByMinRates(curCode);
    const currentDate = getCurentDate();
    res.render("pages/currency", {
      currentDate,
      banksMaxRates,
      banksMinRates,
      maxRates,
      minRates,
      money,
      curCode: curCode.toLowerCase(),
      currency,
      banks,
      currencies,
      exchangeRateBanks: exchangeRateBank,
      exchangeRateVietcombank,
      dateUpdate,
      pageTitle: "Tỷ giá ngân hàng - " + curCode
    });
  },

  getConvertCurtoVND: async (req,res) =>{
    const curCode = req.params.cur;
    const amount = req.query.a;
    const money = await convertCurtoVND(amount, curCode);
    res.json({
      money,
      curCode,
    }
    );
  }
}