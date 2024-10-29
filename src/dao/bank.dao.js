const bankModel = require('../app/models/bank.model');

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
      await bankModel.findOrCreate({
        where: { name: nameBank },
        defaults: {
          name: nameBank,
          fullname: fullnameBank,
          last_updated: null,  // Lưu null nếu ngày giờ không hợp lệ
        },
      });
      continue;  // Bỏ qua hàng này
    }
  
    // Kiểm tra nếu createUpdate tồn tại và là một chuỗi hợp lệ
    if (createUpdate && typeof createUpdate === 'string' && createUpdate.includes(' ')) {
      try {
        // Tách chuỗi thành giờ và ngày
        const [time, date] = createUpdate.split(' ');
  
        if (date && time) {
          const [day, month, year] = date.split('/');
          const [hours, minutes, seconds] = time.split(':');
  
          // Kiểm tra từng phần tử để đảm bảo không bị undefined
          if (day && month && year && hours && minutes && seconds) {
            // Tạo đối tượng Date từ chuỗi đã tách
            const formattedDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`);
            // console.log(`Formatted date for ${codeNameBank}: `, formattedDate);
            
            // Tiếp tục các thao tác với bankModel sau khi tạo thành công formattedDate
            const [bank, created] = await bankModel.findOrCreate({
              where: { name: nameBank },
              defaults: {
                name: nameBank,
                fullname: fullnameBank,
                last_updated: formattedDate, // Lưu thời gian đã chuyển đổi vào updatedAt
              },
            });
            
            // console.log('bank :: ', bank);
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
  return await bankModel.findAll({
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

module.exports = {
  getAllBankData,
  crawlBank,
}