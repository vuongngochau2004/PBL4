const { fetchExchangeRateData } = require('./../../services/exchangeRate.service');
module.exports = {
  createData: () => {
    const siteBankConfig = [
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
        name: 'BIDV',
        url: 'https://bidv.com.vn/vn/ty-gia-ngoai-te',
        rowSelector: '.table-reponsive  tbody tr',
        columnSelector: 'td'
      },
      {
        name: 'Agribank',
        url: 'https://www.agribank.com.vn/vn/ty-gia',
        rowSelector: '#tyGiaCn table tbody tr',
        columnSelector: 'td'
      }
    ];

    const currencies = [
      { code: 'USD', name: 'Đô la Mỹ' },
      { code: 'EUR', name: 'Euro' },
      { code: 'JPY', name: 'Yên Nhật' },
      { code: 'GBP', name: 'Bảng Anh' },
      { code: 'CHF', name: 'Franc Thụy Sĩ' },
      { code: 'CAD', name: 'Đô la Canada' },
      { code: 'AUD', name: 'Đô la Úc' },
      { code: 'NZD', name: 'Đô la New Zealand' },
      { code: 'HKD', name: 'Đô la Hồng Kông' },
      { code: 'CNY', name: 'Nhân dân tệ' },
      { code: 'SGD', name: 'Đô la Singapore' },
      { code: 'TWD', name: 'Đài Loan Đôla' },
      { code: 'NOK', name: 'Krone Na Uy' },
      { code: 'SEK', name: 'Krona Thụy Điển' },
      { code: 'DKK', name: 'Krone Đan Mạch' },
      { code: 'INR', name: 'Rupee Ấn Độ' },
      { code: 'ZAR', name: 'Rand Nam Phi' },
      { code: 'MYR', name: 'Ringgit Malaysia' },
      { code: 'PHP', name: 'Peso Philippines' },
      { code: 'THB', name: 'Bạt Thái Lan' },
      { code: 'HUF', name: 'Phôrin Hungary' },
      { code: 'IDR', name: 'Rupiah Indonesia' },
      { code: 'KHR', name: 'Riel Campuchia' },
      { code: 'KRW', name: 'Won Hàn Quốc' },
      { code: 'KWD', name: 'Dinar Kuwait' },
      { code: 'LAK', name: 'Kíp Lào' },
      { code: 'PLN', name: 'Zloty Ba Lan' },
      { code: 'RUB', name: 'Rúp Nga' },
      { code: 'CZK', name: 'Crone CH' },
      { code: 'SAR', name: 'Riyal Ả Rập Xê-út' }
    ];
    // fetchBankData(siteBankConfig)
    // .catch(console.error);
    // addCurrency(currencies)
    // .catch(console.error);
    fetchExchangeRateData(sitesConfig)
    .catch(console.error);
  }
}