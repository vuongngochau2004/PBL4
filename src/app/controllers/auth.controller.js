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
    const { fullname, email, password } = req.body;

    try {
        // Kiểm tra email đã tồn tại chưa
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ errMessage: "Email đã tồn tại" });
        }

        // Tạo người dùng mới
        const newUser = await User.create({
            fullname,
            email,
            password,
            role: "customer",
            image: "default.jpg",
        });

        // Kiểm tra nếu không tạo được người dùng
        if (!newUser) {
            return res.status(500).json({ errMessage: "Đăng ký không thành công, vui lòng thử lại." });
        }

        // Trả về phản hồi thành công
        return res.status(201).json({ success: "Đăng ký thành công" });
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ errMessage: "Đã xảy ra lỗi, vui lòng thử lại." });
    }
},

  getLogout: (req, res) => {
    // Xóa token khỏi cookie
    res.clearCookie("token");

    res.redirect("/");
  },   
}