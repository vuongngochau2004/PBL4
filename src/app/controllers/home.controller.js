const puppeteer = require('puppeteer');

// Models
const bankModel = require('../models/bank.model');
const currencyModel = require('../models/currency.model');
const exchangeRateModel = require('../models/exchangeRate.model');

const { fetchBankData, findAllBank } = require('../../repository/bank.res');
const { fetchCurrencyData, findAllCurrency } = require('../../repository/currency.res');
const { fetchExchangeRateData } = require('../../repository/exchangeRate.res');


module.exports = {
  getData: async (req, res) => {
    const banks = await findAllBank();
    const currencies = await findAllCurrency();
    // res.render('index', banks);
    res.render("index1", {
      banks: banks,
      currencies: currencies,
      pageTitle: "Home"
    });
  },
  createData: () => {
    const siteCurrencyConfig = [
      {
        name: 'Webgia',
        code_name: 'wg',
        url: "https://vi.wikipedia.org/wiki/Danh_s%C3%A1ch_lo%E1%BA%A1i_ti%E1%BB%81n_t%E1%BB%87_%C4%91ang_l%C6%B0u_h%C3%A0nh",
        rowSelector: '.wikitable tbody tr',
        columnSelector: 'td'
      }
    ]
    const siteBankConfig = [
        // {
        //   name: 'Vietcombank',
        //   code_name: 'VCB',
        //   url: 'https://www.vietcombank.com.vn/vi-VN/KHCN/Cong-cu-Tien-ich/Ty-gia',
        //   rowSelector: 'table tbody tr',
        //   columnSelector: 'td'
        // },
        
      // {
      //   name: 'MB Bank',
      //   code_name: 'MB',
      //   url: 'https://www.mbbank.com.vn/ExchangeRate',
      //   rowSelector: 'table tbody tr',
      //   columnSelector: 'td'
      // },
      // {
      //   name: 'Vietinbank',
      //   code_name: 'VTB',
      //   url: 'https://www.vietinbank.vn/ca-nhan/ty-gia-khcn',
      //   rowSelector: 'table tbody tr',
      //   columnSelector: 'td'
      // },
      {
        name: 'Ngan hang',
        code_name: 'NNN',
        url: 'https://webgia.com/ty-gia/',  
        rowSelector: '#bang_gia tbody tr',
        columnSelector: 'td'
      },
    ];
    const sitesConfig = [
      {
        name: 'Vietcombank',
        code_name: 'VCB',
        url: 'https://www.vietcombank.com.vn/vi-VN/KHCN/Cong-cu-Tien-ich/Ty-gia',
        rowSelector: 'table tbody tr',
        columnSelector: 'td'
      },
      {
        name: 'MB Bank',
        code_name: 'MB',
        url: 'https://www.mbbank.com.vn/ExchangeRate',
        rowSelector: 'table tbody tr',
        columnSelector: 'td'
      },
      {
        name: 'Vietinbank',
        code_name: 'VTB',
        url: 'https://www.vietinbank.vn/ca-nhan/ty-gia-khcn',
        rowSelector: '.hidden #content .table-pin-rows tbody tr',
        columnSelector: 'td'
      },
      {
        name: 'Agribank',
        url: 'https://www.agribank.com.vn/vn/ty-gia',
        rowSelector: '#tyGiaCn table tbody tr',
        columnSelector: 'td'
      }
    ];
    fetchBankData(siteBankConfig)
    .catch(console.error);
    fetchCurrencyData(siteCurrencyConfig)
    .catch(console.error);
    fetchExchangeRateData(sitesConfig)
    .catch(console.error);
  }
}