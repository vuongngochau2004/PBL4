require('dotenv').config();
const { User } = require('../models/index.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  getLogin: (req, res) => {
      res.render("auth/admin/login", {
      pageTitle: "Admin Login",   
      layout: false,
      });
  },
  postLogin: async (req, res) => {
      const { email, password } = req.body; 
      const user = await User.findOne({
          where: {
              email: email,
          },
      });

      if(!user){
          // redender lại trang login với thông báo tài khoản không tồn tại
          return res.status(401).json({ errMessage: "Tài khoản không tồn tại" });
      }

      const checkPass = bcryptjs.compareSync(password, user.password); 
      if(!checkPass){
          // redender lại trang login với thông báo mật khẩu không đúng
         return res.status(401).json({ errMessage: "Mật khẩu không đúng" });
      }
      // jwt
      const payload = {
          id: user.id,
          username: user.username,
          role: user.role,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
      
      // Gửi token về phía client
      res.status(200).json({ token, role: user.role });
  },
  getRegister: (req, res) => {
      res.render("auth/admin/register", {
      pageTitle: "Admin Register",
      layout: false,
      });
  },
  postRegister: async (req, res) => {
      const {fullname, email, password} = req.body;
      const user = await User.findOne({ where: { email: email } });
      
      if (user) {
          // render lại trang register với thông báo email đã tồn tại
          return res.render("auth/admin/register", { 
              pageTitle: "Admin Register",
              layout: false,
              errMessage: "Email đã tồn tại",
          });
      }
      const newUser = await User.create(
          {
              fullname: fullname,
              email: email,
              password: password,
              role: "customer",
              image: "default.jpg",
          }
      );
      res.redirect("login");
  },
  getLogout: (req, res) => {
    // Xóa token khỏi cookie
    res.clearCookie("token");

    res.redirect("/");
  },   
}