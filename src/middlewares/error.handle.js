module.exports = (err, req, res, next) => {
    const error = { ...err };
    error.statusCode = err.statusCode;
    error.message = err.message; 
    
    if (err.name === 'CastError') {
      error.statusCode = 404;
      error.message = 'Không tìm thấy tài nguyên';
    }
  
    if (err.code === 11000) {
      error.statusCode = 400;
      error.message = 'Dữ liệu đã tồn tại';
    }
  
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server. Hãy thử lại sau!';
  
    return res.status(statusCode).json({
      statusCode,
      message,
    });
  };