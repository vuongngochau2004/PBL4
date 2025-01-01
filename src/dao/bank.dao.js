const { Bank, ExchangeRate } = require('../app/models/index.model');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

const  crawlBank = async (exchangeData)=> {
  for (const row of exchangeData) {
    if (row.length < 3 || !row[2]) {
      console.error('Invalid data format for row:', row);
      continue; // Bỏ qua hàng không hợp lệ
    }
    const [ nameBank, fullnameBank, createUpdate] = row;
    // Kiểm tra nếu createUpdate có dấu '...' (dữ liệu không hợp lệ)
    if (!createUpdate || createUpdate.includes('...')) {
      console.log(`Invalid date format for bank ${nameBank}, storing null.`);
      // Lưu vào cơ sở dữ liệu với giá trị null nếu ngày không hợp lệ
      await Bank.findOrCreate({
        where: { name: nameBank },
        defaults: {
          name: nameBank,
          fullname: fullnameBank,
          last_updated: null,  // Lưu null nếu ngày giờ không hợp lệ
        },
      });
      continue;  // Bỏ qua hàng này
    }

    if (createUpdate && typeof createUpdate === 'string' && createUpdate.includes(' ')) {
      try {
        const [time, date] = createUpdate.split(' ');

        if (date && time) {
          const [day, month, year] = date.split('/');
          const [hours, minutes, seconds] = time.split(':');

          // Kiểm tra từng phần tử để đảm bảo không bị undefined
          if (day && month && year && hours && minutes && seconds) {
            // Tạo đối tượng Date ở UTC
            const formattedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

            const existingBank = await Bank.findOne({
              where: { name: nameBank },
            });
            // Tiếp tục các thao tác với bankModel sau khi tạo thành công formattedDate
            if (existingBank) {
              // Nếu bản ghi đã tồn tại, cập nhật bản ghi
              await existingBank.update({
                last_updated: formattedDate,
              });
            } else {
              const [bank, created] = await Bank.findOrCreate({
                where: { name: nameBank },
                defaults: {
                  name: nameBank,
                  fullname: fullnameBank,
                  last_updated: formattedDate, // Lưu thời gian đã chuyển đổi vào updatedAt
                },
              });
            }
          } else {
            console.error(`Invalid date or time format for bank ${nameBank}`);
          }
        }
      } catch (error) {
        console.error(`Error parsing date for bank ${nameBank}:`, error);
      }
    } else {
      console.error(`Invalid or undefined createUpdate for bank ${nameBank}`);
    }
  }
}

const getAllBankData = async () => {
  return await Bank.findAll({
    raw: true  // Trả về các đối tượng thuần túy thay vì instance của Sequelize
  })
  .then(result => {
    return result;  // Trả về trực tiếp vì result đã là một mảng các đối tượng thuần
  })
  .catch(error => {
    console.error(error);
    return [];  // Trả về mảng rỗng nếu có lỗi xảy ra
  });
}

const getBankById = async (id) =>{
  return await Bank.findByPk(id)
  .then(result => {
    return result;  // Trả về trực tiếp vì result đã là một mảng các đối tượng thuần
  })
  .catch(error => {
    console.error(error);
    return [];  // Trả về mảng rỗng nếu có lỗi xảy ra
  });
} 

const getBanksFromExchangeRates = async () => {
  try {
    // Truy vấn để lấy tất cả ngân hàng có trong bảng exchange-rates
    const exchangeRates = await ExchangeRate.findAll({
      attributes: ['bank_id'], // Lấy ra chỉ trường bankId
      group: ['bank_id'], // Nhóm theo bankId để loại bỏ trùng lặp
    });

    // Lấy danh sách bankId
    const bankIds = exchangeRates.map((rate) => rate.bank_id);

    // Lấy các ngân hàng tương ứng với bankIds
    const banks = await Bank.findAll({
      where: {
        id: bankIds,
      },
      raw: true, // Trả về dữ liệu dưới dạng mảng thay vì đối tượng Sequelize
    });

    return banks;
  } catch (error) {
    console.error('Error retrieving banks:', error);
    throw error;
  }
}

module.exports = {
  getAllBankData,
  crawlBank,
  getBankById,
  getBanksFromExchangeRates,
}