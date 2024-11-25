
module.exports = {
  getHome: async (req, res) => {
    res.render("admin/home", {
      pageTitle: "Admin Home",
    });
  }
}
