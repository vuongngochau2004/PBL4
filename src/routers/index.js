const homeRouter = require('./home.router');
const exchangeRateRouter = require('./exchangeRate.router');
const currencyRouter = require('./currency.router');
module.exports = (app)=>{
    app.use('/', homeRouter);
    app.use('/exchange-rate', exchangeRateRouter);
    app.use('/currency', currencyRouter);
}