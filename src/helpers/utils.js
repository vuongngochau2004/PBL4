const formatNumber = (number) => {
  if(number == null){
    return number;
  }
  return number.toLocaleString('en-US');
}

const formatDateTime = (isoDateString) => {
  const date = new Date(isoDateString);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần +1
  const day = String(date.getUTCDate()).padStart(2, '0');

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần +1
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${day}/${month}/${year}`;
}

const parseDateToISO = (dateString) => {
  if(dateString == null){
    return 'Invalid Date';
  }
  // Tách ngày, tháng, năm từ chuỗi `dd/mm/yyyy`
  const [day, month, year] = dateString.split('/').map(Number);

  // Tạo một đối tượng Date theo thứ tự (năm, tháng - 1, ngày)
  const date = new Date(year, month - 1, day);

  // Trả về chuỗi ISO
  return date.toISOString();
};

const convertIsoToDateString = (isoString) => {
  // Chuyển chuỗi ISO thành đối tượng Date
  const date = new Date(isoString);

  // Lấy năm, tháng và ngày
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần cộng thêm 1
  const day = String(date.getUTCDate()).padStart(2, '0');

  // Kết hợp thành chuỗi yyyy-mm-dd
  return `${year}-${month}-${day}`;
};

const formatMoney = (money) => {
  if(money == null){
    return money;
  }
  return money.includes(',') ? money.replace(/,/g, '') :  money;
}

const formatMoneyOther = (money) =>{
  if(money == null){
    return money;
  }
  return money.replace(/\./g,'').replace(/,/g,".");
}

const formatExchangeRate = (value) => {
  // Return empty string for null or undefined
  if (value === null || value === undefined) {
    return '';
  }

  // Convert to number if string is passed
  const number = Number(value);
  
  // Check if value is valid number
  if (isNaN(number)) {
    return '';
  }

  // Split number into integer and decimal parts
  const [integerPart, decimalPart] = number.toString().split('.');

  // Add dot as thousand separator to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // If decimal exists, append it with comma, otherwise return just the integer part
  if (decimalPart) {
    return `${formattedInteger},${decimalPart}`;
  }
  
  return formattedInteger;
};

module.exports = {
  formatNumber,
  formatDateTime,
  formatDate,
  formatMoney,
  formatMoneyOther,
  formatExchangeRate,
  parseDateToISO,
  convertIsoToDateString,
}