const { fetchExchangeRateData, fetchExchangeRateDataTest } = require('./../../services/exchangeRate.service');
const { fetchBankData } = require('./../../services/bank.service');
const { addCurrency } = require('./../../services/currency.service');
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
      },
      {
        name: 'VP Bank',
        url: 'https://www.vpbank.com.vn/ty-gia',
        rowSelector: '.exchange-rate__content .list-dollar tbody tr',
        columnSelector: 'td'
      },
      {
        name: 'Techcombank',
        url: 'https://techcombank.com/cong-cu-tien-ich/ty-gia',
        rowSelector: '.exchange-rate .table-content-container .exchange-rate__table .exchange-rate-table-content .exchange-rate__table-records',
        columnSelector: '.table-records__data .data-content__item',
        columnSelectorHead: '.table__first-column'
      },
      {
        name: 'BaoVietBank',
        url: 'https://www.baovietbank.vn/vn/ti-gia-ngoai-te',
        rowSelector: 'table .jsRenderExchangeRate tr',
        columnSelector: 'td',
      },
      {
        name: 'HD Bank',
        url: 'https://hdbank.com.vn/vi/personal/cong-cu/exchange-rate',
        rowSelector: '.table_tygia tbody tr',
        columnSelector: 'td',
      },
      {
        name: 'HSBC',
        url: 'https://www.hsbc.com.vn/foreign-exchange/rate/',
        rowSelector: '#content_main_basicTable_2 .desktop tbody tr',
        columnSelector: 'td',
        columnSelectorHead: 'th'
      },
      {
        name: 'VIB',
        url: 'https://www.vib.com.vn/vn/ty-gia/bang-ty-gia',
        rowSelector: '#dataList #dataListTable .vib-v2-line-box-table-deposit',
        columnSelector: '.vib-v2-right-slider-table .vib-v2-slider-mobile-table .vib-v2-colum-table-deposit',
        columnSelectorHead: '.vib-v2-fix-row1-table .text',
      },
      {
        name: 'TPBank',
        url: 'https://tpb.vn/cong-cu-tinh-toan/ty-gia-ngoai-te',
        rowSelector: '.table tbody tr',
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
      { code: 'SAR', name: 'Riyal Ả Rập Xê-út' },
      { code: 'MXN', name: 'Mexican Peso'},
      { code: 'NGN', name: 'Nigerian Naira'}
    ];
    fetchBankData(siteBankConfig)
    .catch(console.error);
    addCurrency(currencies)
    .catch(console.error);
    fetchExchangeRateData(sitesConfig)
    .catch(console.error);
    // fetchExchangeRateDataTest(sitesConfig)
    // .catch(console.error);
  }
}