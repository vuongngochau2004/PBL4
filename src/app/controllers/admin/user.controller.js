const { findAllCustomers } = require('../../../services/user.service');
module.exports = {
  getUsers: async (req, res) => {
    const users = await findAllCustomers();
    res.render("admin/users", {
      users,
      pageTitle: "Danh sách người dùng",
    });
  }, 
}
