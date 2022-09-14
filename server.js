const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookie_parser = require('cookie-parser');

dotenv.config();

mongoose.connect('mongodb://localhost:27017/chat', { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err)
        throw err;
    console.log('Connect DB success...');
});

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(cookie_parser());


app.use('/', require('./routes/base.route'));
app.use('/message', require('./routes/message.route'));


app.listen(
    process.env.PORT,
    process.env.HOST,
    () => { console.log('Server running...') });

