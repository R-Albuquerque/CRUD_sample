const { checkToken, checkRefreshToken } = require('./checkTokens.js');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const router = express.Router();
var cookieParser = require('cookie-parser')
const path  = __dirname + '/public/';
const home_path = __dirname;

const auth_router = require('./auth_user.js');
const client_router = require('./clients.js');
const make_router = require('./makeUsers.js');
// const { json } = require('express');

app.use(express.json());
app.set('view-engine', 'ejs');
app.use(cookieParser());
app.use('/login',auth_router);
app.use('/clients',client_router);
app.use('/create',make_router);
app.use('/js', express.static(path+'js'));
app.use('/css', express.static(path+'css'));
app.use('/ext', express.static(path+'external'));


app.get('/',checkToken, (req,res) =>{
  
    res.render('index.ejs', {name: 'Rafael'});
  
});

app.get("/this_error", (req,res)=>{
  res.sendFile(path + 'this_error.html');
})


app.listen(3003, function() {
	console.log("App rodando na porta 3003!");
})
