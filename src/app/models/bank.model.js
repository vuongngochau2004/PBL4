const { DataTypes } = require('sequelize');
const { sequelize } = require('./../../configs/database'); // Giả sử bạn đã thiết lập Sequelize

const bank = sequelize.define('bank', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,    // Đảm bảo mã code_name là duy nhất
    validate: {
      notEmpty: true, // Không được để trống
    },
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Không được để trống
    },
  },
  last_updated: {
    type: DataTypes.DATE, // Trường để lưu thời gian update từ createUpdate
    allowNull: true,      // Có thể null nếu dữ liệu không hợp lệ
  },
}, {
  timestamps: true,      // Tự động thêm createdAt và updatedAt
});


module.exports = bank;

