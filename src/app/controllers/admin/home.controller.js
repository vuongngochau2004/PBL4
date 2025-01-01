const { editUser } = require('../../../services/user.service');

module.exports = {
  getHome: async (req, res) => {
    res.render("admin/home", {
      pageTitle: "Trang chủ quản lí",
    });
  }, 
  getProfile: (req, res) => {
    res.render("admin/profile", {
      pageTitle: "Trang cá nhân",
    });
  },
  postProfile: async (req, res) => {
    const body = req.body;
    console.log('req.file:', req.file);
    body.image = req.file.filename;
    const user = await editUser(req.user.id, body);
    res.redirect("/admin/profile");
  },
}
