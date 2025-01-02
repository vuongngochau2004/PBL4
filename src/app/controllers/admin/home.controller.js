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
    if(req.file){
      body.image = req.file.filename;
    }else {
      body.image = req.user.image;
    }
    const user = await editUser(req.user.id, body);
    res.redirect("/admin/profile");
  },
}
