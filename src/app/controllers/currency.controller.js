const { fetchCurrencyData } = require('./../../repository/currency.res');
module.exports = {
  createCurrency: () =>{
    const siteCurrencyConfig = [
      {
        name: 'Webgia',
        code_name: 'wg',
        url: "https://vi.wikipedia.org/wiki/Danh_s%C3%A1ch_lo%E1%BA%A1i_ti%E1%BB%81n_t%E1%BB%87_%C4%91ang_l%C6%B0u_h%C3%A0nh",
        rowSelector: '.wikitable tbody tr',
        columnSelector: 'td'
      }
    ]
    
    fetchCurrencyData(siteCurrencyConfig);
  }
}