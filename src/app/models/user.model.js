const { DataTypes } = require('sequelize');
const { sequelize } = require('../../configs/database'); // Adjust the path as needed
const bcryptjs = require('bcryptjs');

const user = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'default.jpg'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
}, {
  timestamps: true,
  underscored: true
});
user.beforeCreate(async (user, options) => {
  if (user.password) {
    user.password = await bcryptjs.hash(user.password, 10);
  }
});

user.beforeUpdate(async (user, options) => {
  if (user.password) {
    user.password = await bcryptjs.hash(user.password, 10);
  }
});

user.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = user;