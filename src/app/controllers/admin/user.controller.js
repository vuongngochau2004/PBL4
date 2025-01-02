const { findAllCustomers, lockUser } = require('../../../services/user.service');
const { searchUsersData } = require('../../../services/search.service');
module.exports = {
  getUsers: async (req, res) => {
    const users = await findAllCustomers();
    res.render("admin/users", {
      users,
      pageTitle: "Danh sách người dùng",
    });
  }, 

  getSearchUsers: async (req, res) => {
    const query = req.query.q;
    const users = await searchUsersData(query);
    res.render("admin/users", {
      users,
      pageTitle: "Danh sách người dùng",
    });
  },

  postLockUser: async (req, res) => {
    const { id } = req.body;
    const user = await lockUser(id);
    console.log(user);
    res.redirect("/admin/users");
  }
}
