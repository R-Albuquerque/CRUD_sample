const express = require('express');
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
const http = require("http");
const axios = require('axios');
const bodyParser = require("body-parser");
// var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser');

const auth_router = require('./auth_user.js');
const siv_router = require('./sivs.js');
const env_router = require('./envs.js');
const progTable_router = require('./progTables.js');
// var router = express.Router();
app.use('/login',auth_router);
app.use('/sivs',siv_router);
app.use('/envs',env_router);
app.use('/progTables',progTable_router);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/js', express.static(path+'js')); // CLIENT-SIDE SCRIPTS
app.use('/css', express.static(path+'css')); // CSS FILES
app.use('/images', express.static(path+'images')); // IMAGES
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist'));

app.get('/',function(req, res){
  if (true) {
    res.sendFile(path + 'home.html');
  }

});

app.get("/this_error", (req,res)=>{
  res.sendFile(path + 'this_error.html');
})



app.listen(3000, function() {
	console.log("App rodando na porta 3000!");
})