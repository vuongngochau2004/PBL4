const { scrapeSite, scheduleScraping, scheduleScrapingExchangeRate } = require('../helpers/crawl.helper');
const { 
  crawlTPBankData,
  crawlHSBCData,
  crawlHDBankData,
  crawlVIBData,
  crawlBaoVietBankData,
  crawlTechcombankData,
  crawlVPbankData,
  crawlVietcombankData,
  crawlMBbankData,
  crawlAgribankData,
  crawlBIDVData,
  getExchangeRateByBankId, 
  getExchangeRateCurrencyByBankId,
  getExchangeRateBankByCurrencyId,
  getExchangeRateVietcombank,
  getExchangeRateCurrencyByBankIdAndDate,
  getExchangeRateCurrencyByBankIdAndDateAndCurrencyCode,
} = require('../dao/exchangeRate.dao');
const { formatDateTime, formatMoneyOther, formatExchangeRate, formatDate, parseDateToISO, convertIsoToDateString } = require('../helpers/utils.helper');

const fetchExchangeRateData = async (sitesConfig) => {
  for (const site of sitesConfig) {
    scheduleScrapingExchangeRate(site, async (exchangeRate) => {
      if (site.name == "Vietcombank") {
        await crawlVietcombankData(exchangeRate);
      }
      if (site.name == "MB Bank") {
        await crawlMBbankData(exchangeRate);
      }
      if (site.name == "Agribank") {
        await crawlAgribankData(exchangeRate);
      }
      if(site.name == "BIDV"){
        await crawlBIDVData(exchangeRate);
      }
      if(site.name == "VP Bank"){
        await crawlVPbankData(exchangeRate);
      }
      if(site.name == "Techcombank"){
        await crawlTechcombankData(exchangeRate);
      }
      if(site.name == "BaoVietBank"){
        await crawlBaoVietBankData(exchangeRate);
      }
      if (site.name == "HD Bank") {
        await crawlHDBankData(exchangeRate);
      }
      if (site.name == "HSBC") {
        await crawlHSBCData(exchangeRate);
      }
      if (site.name == "VIB") {
        await crawlVIBData(exchangeRate);
      }
      if(site.name == "TPBank"){
        await crawlTPBankData(exchangeRate);
      }
    });
  }
};

const fetchExchangeRateDataTest = async (sitesConfig) => {
  for (const site of sitesConfig) {
    await scrapeSite(site, async (exchangeRate) => {
      if (site.name == "VIB") {
        await crawlVIBData(exchangeRate);
      }
    });
  }
};

const findExchangeRateByBankId = async (id) => {
  const exchangeRates = await getExchangeRateByBankId(id);
  for(const row of exchangeRates){
    row.buy_cash_price = formatExchangeRate(row.buy_cash_price);
    row.buy_transfer_price = formatExchangeRate(row.buy_transfer_price);
    row.sell_cash_price = formatExchangeRate(row.sell_cash_price);
    row.sell_transfer_price = formatExchangeRate(row.sell_transfer_price);
    row.currency.code_lowercase = row.currency.code.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D').replace(/đ/g, 'd').replace(/\s+/g, '').toLowerCase();
    row.createdAt = formatDateTime(row.createdAt);
  }
  return exchangeRates;
}

const findExchangeRateCurrencyByBankId = async (id) => {
  const exchangeRates = await getExchangeRateCurrencyByBankId(id);
  for(const row of exchangeRates){
    row.buy_cash_price = formatExchangeRate(row.buy_cash_price);
    row.buy_transfer_price = formatExchangeRate(row.buy_transfer_price);
    row.sell_cash_price = formatExchangeRate(row.sell_cash_price);
    row.sell_transfer_price = formatExchangeRate(row.sell_transfer_price);
    row.currency.code_lowercase = row.currency.code.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D').replace(/đ/g, 'd').replace(/\s+/g, '').toLowerCase().slice(0, 3);
    row.createdAt = formatDateTime(row.createdAt);
  }
  return exchangeRates;
}

const findExchangeRateCurrencyByBankIdAndDate = async (id, dateISO) => {
  const exchangeRates = await getExchangeRateCurrencyByBankIdAndDate(id, dateISO);
  for(const row of exchangeRates){
    row.buy_cash_price = formatExchangeRate(row.buy_cash_price);
    row.buy_transfer_price = formatExchangeRate(row.buy_transfer_price);
    row.sell_cash_price = formatExchangeRate(row.sell_cash_price);
    row.sell_transfer_price = formatExchangeRate(row.sell_transfer_price);
    row.currency.code_lowercase = row.currency.code.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D').replace(/đ/g, 'd').replace(/\s+/g, '').toLowerCase().slice(0, 3);
    row.createdAt = formatDateTime(row.createdAt);
  }
  return exchangeRates;
}

const dateExchangeRateByBankId = async (id) => {
  const exchangeRates = await getExchangeRateByBankId(id);
  if(exchangeRates.length == 0){
    return '';
  }
  return formatDate(exchangeRates[0].createdAt);
}

const datesOfWeekPre = (curDate) => {
  const [day, month, year] = curDate.split('/');
  const dates = [];
  for (let i = 0; i <= 6; i++) {
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() - i);
    dates.push(date);
  }
  // dao nguoc mảng
  dates.reverse();
  return dates;
}

const getExchangeRateByBankIdAndDateAndCurrency = async (id, dates, currencies) => {
  let result = {
    dates: [],
    rates: {}
  };
  for (const date of dates) {
    result.dates.push(formatDate(date));
  }
  for (const currencyCode of currencies) {
    result.rates[currencyCode] = []; // Khởi tạo mảng cho mỗi loại tiền tệ
    for (const date of dates) {
      const exchangeRate = await getExchangeRateCurrencyByBankIdAndDateAndCurrencyCode(id, date, currencyCode);
      if (exchangeRate) {
        result.rates[currencyCode].push(exchangeRate.buy_transfer_price); // Thêm tỷ giá vào mảng
      } else {
        result.rates[currencyCode].push(null); // Thêm null nếu không tìm thấy tỷ giá
      }
    }
  }

  return result;
}

const preDate = (curDate) => {
  const [day, month, year] = curDate.split('/');
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1); // Tăng 1 ngày
  return date;
};

const preDateFormat = (curDate) => {
  return formatDate(curDate);
}

const nextDate = (curDate) => {
  const [day, month, year] = curDate.split('/');
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1); // Tăng 1 ngày
  return date;
};

const nextDateFormat = (curDate) => {
  return formatDate(curDate);
}

const findExchangeRateBankByCurrencyId = async (curCode) => {
  const exchangeRates = await getExchangeRateBankByCurrencyId(curCode);
  for (let i = 0; i < exchangeRates.length; i++) {
    for (let j = i+1; j < exchangeRates.length; j++) {
      if(exchangeRates[i].bank.name ===  exchangeRates[j].bank.name){
        exchangeRates.splice(j, 1); // Xóa phần tử exchangeRates[j]
        j--; // Giảm j để không bỏ qua phần tử tiếp theo sau khi xóa
      }
    }
  }
  for(const row of exchangeRates){
    row.buy_cash_price = formatExchangeRate(row.buy_cash_price);
    row.buy_transfer_price = formatExchangeRate(row.buy_transfer_price);
    row.sell_cash_price = formatExchangeRate(row.sell_cash_price);
    row.sell_transfer_price = formatExchangeRate(row.sell_transfer_price);
    row.bank.name_lowercase = row.bank.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/Đ/g, 'D').replace(/đ/g, 'd').replace(/\s+/g, '').toLowerCase();
    row.createdAt = formatDateTime(row.createdAt);
  }
  return exchangeRates;
}

const findExchangeRateVietcombank = async () => {
  const exchangeRates = await getExchangeRateVietcombank();
  for(const row of exchangeRates){
    row.buy_cash_price = formatExchangeRate(row.buy_cash_price);
    row.buy_transfer_price = formatExchangeRate(row.buy_transfer_price);
    row.sell_cash_price = formatExchangeRate(row.sell_cash_price);
    row.sell_transfer_price = formatExchangeRate(row.sell_transfer_price);
    row.createdAt = formatDateTime(row.createdAt);
  }
  return exchangeRates;
}

const dateUpdateVietcombank = async () => {
  const exchangeRates = await getExchangeRateVietcombank();
  return formatDateTime(exchangeRates[0].createdAt);
}

const getAverageAllRates = async (curCode) => {
  let totalSum = 0;
  let totalCount = 0;

  const bankRates = await findExchangeRateBankByCurrencyId(curCode);

  Object.values(bankRates).forEach(bank => {
    const buy_cash_price = formatMoneyOther(bank.buy_cash_price);
    const buy_transfer_price = formatMoneyOther(bank.buy_transfer_price);
    const sell_cash_price = formatMoneyOther(bank.sell_cash_price);
    const sell_transfer_price = formatMoneyOther(bank.sell_transfer_price);
    if(parseFloat(buy_cash_price) > 0) {
      totalSum += parseFloat(buy_cash_price);
      totalCount++;
    }else if(parseFloat(buy_transfer_price) > 0){
      totalSum += parseFloat(buy_transfer_price);
      totalCount++;
    }else if(parseFloat(sell_cash_price) > 0){
      totalSum += parseFloat(sell_cash_price);
      totalCount++;
    }else if(parseFloat(sell_transfer_price) > 0){
      totalSum += parseFloat(sell_transfer_price);
      totalCount++;
    }
  });

  return totalCount > 0 ? parseFloat((totalSum / totalCount).toFixed(3)) : 0;
}

const convertCurtoVND = async (curAmount, curCode) => {
  const averageRate = await getAverageAllRates(curCode);
  return {
    curAmount,
    vndAmount: formatExchangeRate(curAmount * averageRate),
    averageRate: formatExchangeRate(averageRate),
  };
}

const getMaxAverageRate = async (curCode) => {
  let maxBuyCashPrice = 0;
  let maxBuyTransferPrice = 0;
  let maxSellCashPrice = 0;
  let maxSellTransferPrice = 0;
  const bankRates = await findExchangeRateBankByCurrencyId(curCode);
  Object.values(bankRates).forEach(bank => {
    const buy_cash_price = formatMoneyOther(bank.buy_cash_price);
    const buy_transfer_price = formatMoneyOther(bank.buy_transfer_price);
    const sell_cash_price = formatMoneyOther(bank.sell_cash_price);
    const sell_transfer_price = formatMoneyOther(bank.sell_transfer_price);
    if(parseFloat(buy_cash_price) > maxBuyCashPrice) {
      maxBuyCashPrice = parseFloat(buy_cash_price);
    }
    if(parseFloat(buy_transfer_price) > maxBuyTransferPrice){
      maxBuyTransferPrice = parseFloat(buy_transfer_price);
    }
    if(parseFloat(sell_cash_price) > maxSellCashPrice){
      maxSellCashPrice = parseFloat(sell_cash_price);
    }
    if(parseFloat(sell_transfer_price) > maxSellTransferPrice){
      maxSellTransferPrice = parseFloat(sell_transfer_price);
    }
  });
  return {
    maxBuyCashPrice: formatExchangeRate(maxBuyCashPrice),
    maxBuyTransferPrice: formatExchangeRate(maxBuyTransferPrice),
    maxSellCashPrice: formatExchangeRate(maxSellCashPrice),
    maxSellTransferPrice: formatExchangeRate(maxSellTransferPrice),
  };
}

const getMinAverageRate = async (curCode) => {
  let minBuyCashPrice = 10000000;
  let minBuyTransferPrice = 10000000;
  let minSellCashPrice = 10000000;
  let minSellTransferPrice = 10000000;
  const bankRates = await findExchangeRateBankByCurrencyId(curCode);
  Object.values(bankRates).forEach(bank => {
    const buy_cash_price = formatMoneyOther(bank.buy_cash_price);
    const buy_transfer_price = formatMoneyOther(bank.buy_transfer_price);
    const sell_cash_price = formatMoneyOther(bank.sell_cash_price);
    const sell_transfer_price = formatMoneyOther(bank.sell_transfer_price);
    if(parseFloat(buy_cash_price) < minBuyCashPrice) {
      minBuyCashPrice = parseFloat(buy_cash_price);
    }
    if(parseFloat(buy_transfer_price) < minBuyTransferPrice){
      minBuyTransferPrice = parseFloat(buy_transfer_price);
    }
    if(parseFloat(sell_cash_price) < minSellCashPrice){
      minSellCashPrice = parseFloat(sell_cash_price);
    }
    if(parseFloat(sell_transfer_price) < minSellTransferPrice){
      minSellTransferPrice = parseFloat(sell_transfer_price);
    }
  });
  return {
    minBuyCashPrice: formatExchangeRate(minBuyCashPrice),
    minBuyTransferPrice: formatExchangeRate(minBuyTransferPrice),
    minSellCashPrice: formatExchangeRate(minSellCashPrice),
    minSellTransferPrice: formatExchangeRate(minSellTransferPrice),
  };
}

const getBanksByMaxRates = async (curCode) => {
  let buyCashPriceBanks = [];
  let buyTransferPriceBanks = [];
  let sellCashPriceBanks = [];
  let sellTransferPriceBanks = [];
  const bankRates = await findExchangeRateBankByCurrencyId(curCode);
  const maxRates = await getMaxAverageRate(curCode);
  Object.values(bankRates).forEach(bank => {
    const buy_cash_price = formatMoneyOther(bank.buy_cash_price);
    const buy_transfer_price = formatMoneyOther(bank.buy_transfer_price);
    const sell_cash_price = formatMoneyOther(bank.sell_cash_price);
    const sell_transfer_price = formatMoneyOther(bank.sell_transfer_price);
    if(formatExchangeRate(buy_cash_price) == maxRates.maxBuyCashPrice){
      buyCashPriceBanks.push(bank);
    }
    if(formatExchangeRate(buy_transfer_price) == maxRates.maxBuyTransferPrice){
      buyTransferPriceBanks.push(bank);
    }
    if(formatExchangeRate(sell_cash_price) == maxRates.maxSellCashPrice){
      sellCashPriceBanks.push(bank);
    }
    if(formatExchangeRate(sell_transfer_price) == maxRates.maxSellTransferPrice){
      sellTransferPriceBanks.push(bank);
    }
  });
  return {
    buyCashPriceBanks,
    buyTransferPriceBanks,
    sellCashPriceBanks,
    sellTransferPriceBanks,
  };
}

const getBanksByMinRates = async (curCode) => {
  let buyCashPriceBanks = [];
  let buyTransferPriceBanks = [];
  let sellCashPriceBanks = [];
  let sellTransferPriceBanks = [];
  const bankRates = await findExchangeRateBankByCurrencyId(curCode);
  const minRates = await getMinAverageRate(curCode);
  Object.values(bankRates).forEach(bank => {
    const buy_cash_price = formatMoneyOther(bank.buy_cash_price);
    const buy_transfer_price = formatMoneyOther(bank.buy_transfer_price);
    const sell_cash_price = formatMoneyOther(bank.sell_cash_price);
    const sell_transfer_price = formatMoneyOther(bank.sell_transfer_price);
    if(formatExchangeRate(buy_cash_price) == minRates.minBuyCashPrice){
      buyCashPriceBanks.push(bank);
    }
    if(formatExchangeRate(buy_transfer_price) == minRates.minBuyTransferPrice){
      buyTransferPriceBanks.push(bank);
    }
    if(formatExchangeRate(sell_cash_price) == minRates.minSellCashPrice){
      sellCashPriceBanks.push(bank);
    }
    if(formatExchangeRate(sell_transfer_price) == minRates.minSellTransferPrice){
      sellTransferPriceBanks.push(bank);
    }
  });
  return {
    buyCashPriceBanks,
    buyTransferPriceBanks,
    sellCashPriceBanks,
    sellTransferPriceBanks,
  };
}

const getCurentDate = () => {
  const date = new Date();
  return formatDate(date);
}

module.exports = {
  getCurentDate,
  fetchExchangeRateData,
  findExchangeRateByBankId,
  findExchangeRateCurrencyByBankId,
  findExchangeRateBankByCurrencyId,
  fetchExchangeRateDataTest,
  findExchangeRateVietcombank,
  dateUpdateVietcombank,
  convertCurtoVND,
  getMaxAverageRate,
  getMinAverageRate,
  getBanksByMaxRates,
  getBanksByMinRates,
  dateExchangeRateByBankId,
  preDate,
  nextDate,
  findExchangeRateCurrencyByBankIdAndDate,
  preDateFormat,
  nextDateFormat,
  datesOfWeekPre,
  getExchangeRateByBankIdAndDateAndCurrency,
}