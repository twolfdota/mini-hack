const express = require('express');
const Router = require('./router');
const config = require('./config.json');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ctrl = require('./Controller.js');

let app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');



// app.get('/question', Router);


mongoose.connect(config.dbUrl, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connect success!");
    }
});

app.use('/', Router);

app.use(express.static('./public'));

app.listen(config.port, (err) => {
    console.log(err);
    console.log(`App is listening at port  ${config.port}`);
});
