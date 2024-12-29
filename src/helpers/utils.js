const formatNumber = (number) => {
  if(number == null){
    return number;
  }
  return number.toLocaleString('en-US');
}

const formatDateTime = (isoDateString) => {
  const date = new Date(isoDateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần +1
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

const formatMoney = (money) => {
  return money.includes(',') ? money.replace(/,/g, '') :  money;
}

const formatMoneyOther = (money) =>{
  if(money == null){
    return money;
  }
  return money.replace(/\./g,'').replace(/,/g,".");
}

module.exports = {
  formatNumber,
  formatDateTime,
  formatMoney,
  formatMoneyOther
}