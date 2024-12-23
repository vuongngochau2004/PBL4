require("dotenv").config();
const jwt = require('jsonwebtoken');
const { User } = require('./../app/models/index.model');
const ErrorResponse = require('../helpers/errorResponse');

module.exports = async (req, res, next) => {

    // Lấy token từ cookie
    const token = req.cookies.token;

    console.log(token);
    if (!token) {
        return next(new ErrorResponse(401, 'Unauthorized'));
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findByPk(decode.id);

        if (!user) {
        return next(new ErrorResponse(401, 'Unauthorized'));
        }

        req.user = user;
        res.locals.user = user; // Lưu thông tin người dùng vào res.locals
        next();
    } catch (error) {
        return next(new ErrorResponse(401, 'Unauthorized'));
    }
}