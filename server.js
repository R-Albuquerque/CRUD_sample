const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();
const router = express.Router();
var cookieParser = require('cookie-parser')
const path  = __dirname + '/public/';

const auth_router = require('./auth_user.js');
const make_router = require('./makeUsers.js');

app.use(express.json());
app.set('view-engine', 'ejs');
app.use(cookieParser());
app.use('/login',auth_router);
app.use('/create',make_router);
app.use('/js', express.static(path+'js'));
app.use('/css', express.static(path+'css'));
app.use('/bootstrap', express.static(path+'external/bootstrap'));
app.use('/jquery', express.static(path+'external/jquery'));


app.get('/',checkToken, (req,res) =>{
  
    res.render('index.ejs', {name: 'Rafael'});
  
});

function checkToken(req,res,next){
  const authHeader = req.cookies['authorization'];
  console.log(req.headers);
  console.log(authHeader);
  const token = authHeader;
  if (token == null) {
    return res.render('error.ejs', {erro: 'No Token'});
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
      if(err){
          return res.render('error.ejs', {erro: 'Invalid Token'})
    };
      req.user = user;
      next();
  }
  )
}


app.get("/this_error", (req,res)=>{
  res.sendFile(path + 'this_error.html');
})


app.listen(3003, function() {
	console.log("App rodando na porta 3003!");
})
