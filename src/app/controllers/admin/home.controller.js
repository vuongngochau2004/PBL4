
module.exports = {
  getHome: async (req, res) => {
    res.render("admin/home", {
      pageTitle: "Admin Home",
    });
  }, 
  getUsers: async (req, res) => {
    res.render("admin/users", {
      pageTitle: "User Management",
    });
  }
}
