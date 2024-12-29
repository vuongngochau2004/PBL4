const { Sequelize } = require('sequelize');

 // Khởi tạo kết nối với MySQL sử dụng connection pool
 const sequelize = new Sequelize('crawl', 'root', '', {
  host: 'localhost', // hoặc địa chỉ máy chủ của MySQL
  dialect: 'mysql',  // Chọn loại cơ sở dữ liệu
  pool: {
    max: 10,            // Số kết nối tối đa trong pool
    min: 0,             // Số kết nối tối thiểu trong pool
    acquire: 30000,     // Thời gian tối đa (ms) để cố gắng kết nối trước khi throw lỗi
    idle: 10000         // Thời gian (ms) một kết nối có thể idle trước khi bị đóng
  },
});
const connect = async () => {
  try {
    // Thử kết nối đến cơ sở dữ liệu
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Đồng bộ hóa các mô hình với cơ sở dữ liệu
    await sequelize.sync({alter: false});
    console.log('Database & tables created!');
    
  } catch (error) {
    // Xử lý lỗi kết nối hoặc đồng bộ hóa
    console.error('Unable to connect to the database or create tables:', error);
  }
};
module.exports = { sequelize , connect};
