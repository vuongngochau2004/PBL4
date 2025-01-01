require("dotenv").config();
const jwt = require('jsonwebtoken');
const { User } = require('./../app/models/index.model');
const ErrorResponse = require('../helpers/errorResponse');

module.exports = async (req, res, next) => {

    // Lấy token từ cookie
    const token = req.cookies.token;

    if (!token) {
        res.locals.user = null; // Không tìm thấy user, gán user là null
        return next();
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findByPk(decode.id);

        if (!user) {
            res.locals.user = null; // Không tìm thấy user, gán user là null
            return next();
        }

        req.user = user;
        res.locals.user = user; // Lưu thông tin người dùng vào res.locals
        next();
    } catch (error) {
        res.locals.user = null; // Lỗi xác thực, gán user là null
        return next();
    }
}