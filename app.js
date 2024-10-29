const express = require('express');
const app = express();
const port = 3000;

const router = require('./src/routers/index');

const db = require('./src/configs/database');

db.connect();

// body parser
app.use(express.urlencoded({ extended: true,}));
app.use(express.json());
// app.use(express.static('./src/uploads'));

app.set('views', './src/resources/views');
app.set('view engine', 'ejs');


// Route init
router(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});