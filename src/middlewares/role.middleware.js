const ErrorResponse = require('../helpers/ErrorResponse');

module.exports = (roles = []) => {
    if(typeof roles === "string"){
        roles = [roles];
    }

    return (req, res, next) =>{
        if (!req.user) {
            return next(new ErrorResponse(401, 'Unauthorized'));
        }
    
        if (roles.length && !roles.includes(req.user.role)) {
            return next(new ErrorResponse(403, 'Forbidden'));
        }
        next();
    };
}