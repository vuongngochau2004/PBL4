require('dotenv').config();
const { User } = require('./../../models/index.model');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
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
          return res.render("auth/admin/login", {
              pageTitle: "Admin Login",
              layout: false,
              errMessage: "Tài khoản không tồn tại",
          });
      }

      const checkPass = bcryptjs.compareSync(password, user.password); 
      if(!checkPass){
          // redender lại trang login với thông báo mật khẩu không đúng
          return res.render("auth/admin/login", {
              pageTitle: "Admin Login",
              layout: false,
              errMessage: "Mật khẩu không đúng",
          });
          // throw new ErrorResponse(401, "Tài khoản không tồn tại!!");
      }
      // jwt
      const payload = {
          id: user.id,
          username: user.username,
          role: user.role,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
      
      console.log(token);
      // Gửi token về phía client
      res.json({ token });
  },
  getRegister: (req, res) => {
      res.render("auth/admin/register", {
      pageTitle: "Admin Register",
      layout: false,
      });
  },
  postRegister: async (req, res) => {
      const {fullname, email, password} = req.body;
      console.log(fullname, email, password);
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
              role: "admin",
          }
      );
      res.redirect("login");
  },
  getForgotPassword: (req, res) => {
      res.render("auth/admin/forgot-password", {
      pageTitle: "Admin Forgot Password",
      layout: false,
      });
  },
  postForgotPassword: (req, res) => {
      res.send("Forgot Password");
  },
  getLogout: (req, res) => {
      res.render("auth/admin/login", {
          pageTitle: "Admin Logout",
          layout: false,
      });
  },   
}