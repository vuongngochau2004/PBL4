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
        next();
    } catch (error) {
        return next(new ErrorResponse(401, 'Unauthorized'));
    }
    // const { authorization } = req.headers;
    // if (!authorization || !authorization.startsWith("Bearer ")){
    //     throw new ErrorResponse(401, 'Unauthorized');
    // }
    // // Bearer lfjasdlkfjdsafdsf
    // const token = authorization.split(' ')[1];
    // //giải mã ra payload mà lúc login đã mã hóa
    // try {
    //     const decode = jwt.verify(token, process.env.SECRET_KEY);
    //     const user = await User.findByPk(decode._id);
    
    //     if (!user) {
    //       return next(new ErrorResponse(401, 'Unauthorized'));
    //     }
    
    //     req.user = user;
    //     next();
    // } catch (error) {
    //     return next(new ErrorResponse(401, 'Unauthorized'));
    // }
}