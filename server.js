const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express();
const router = express.Router();
var cookieParser = require('cookie-parser')
const path  = __dirname + '/public/';

const auth_router = require('./auth_user.js');
const client_router = require('./clients.js');
const make_router = require('./makeUsers.js');
const { json } = require('express');

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

function checkToken(req,res,next){
  const authHeader = req.headers.cookie;
  // console.log(req.headers);
  console.log(authHeader);
  const token = authHeader && authHeader.split("; ")[0].split("=")[1];
  const rtoken = authHeader && authHeader.split("; ")[1].split("=")[1];
  // jwt.decode(token);
  // console.log("TOKEN - ");
  // console.log(jwt.decode(token));
  // console.log("RTOKEN - "+rtoken);
  // console.log((rtoken));
  if (token == null) {
    return res.render('error.ejs', {erro: 'No Token', redirect: './login'});
  }
  console.log("is it ? "+JSON.stringify(jwt.decode(token)));

  // Remember to improve this logic 
  if (!jwt.decode(token).exp) {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err,user) => {
      if(err){
          // console.log(err);
          return res.render('error.ejs', {erro: 'Invalid Token', redirect: './login'})
      };
      req.user = user;
      next();      
    })
  }
  else if ((jwt.decode(token).exp) && (Date.now() >= (jwt.decode(token).exp * 1000))) {
    console.log('EXPIRED COOKIE');
    return res.redirect("./login/refresh");
  }
  else {
    
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err){
            return res.render('error.ejs', {erro: 'Invalid Token', redirect: './login'})
      };
      req.user = user;
        next();      
      })
      
  }
  
  
}

app.get("/this_error", (req,res)=>{
  res.sendFile(path + 'this_error.html');
})


app.listen(3003, function() {
	console.log("App rodando na porta 3003!");
})
