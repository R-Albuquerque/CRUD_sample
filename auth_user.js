require('dotenv').config();
const {checkRefreshToken} = require('./checkTokens.js');
const express = require('express');
const bodyParser = require("body-parser");
const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const http = require("http");
var cookieParser = require('cookie-parser');
const db = new sqlite.Database('./data/crud.sqlite');


auth_router = express.Router();
auth_router.use(bodyParser.urlencoded({
    extended: true
}));
auth_router.use(bodyParser.json());

// ================ Show Login page
auth_router.get('/', (req,res)=>{
  res.render('login.ejs');
})

// === USER LOGIN
auth_router.post('/', async (req,res)=>{
  console.log(req.body);
    var uname = req.body.username;
    var password = req.body.password;

    getUser(uname, (err, user)=>{
      // Chek if there's any error
      if (err) return  res.status(500).send('Server error!');
      // Check if user exists
      if (!user) return  res.status(404).send('User not found!');
      // Check if password recieved is equal to the user password
      const  result  =  bcrypt.compareSync(password, user.password);
      if(!result) return res.render('error.ejs', {erro: 'Invalid password', redirect: './login'});
      // Finally, if there are no errors, generate access token and refresh token
      const userData = { id:user.id, user:user.username,is_admin:user.is_admin };
      const accessToken  =  generateAccessToken(userData);
      const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);

      // === Save Refresh token on database
      const createRefreshTokenQuery = `INSERT INTO \`refresh_tokens\`
                      (\`token\`,\`user_id\`)
                      VALUES
                      ("${refreshToken}","${user.id}");`;                                        
      db.run(createRefreshTokenQuery, function(error){
        if(error){
          res.status(401).send('Authentication error');
          console.log(error);
          return
      };
      // === Set access and refresh tokens
        res.cookie('authorization', `${accessToken}`);
        res.cookie('refreshToken', `${refreshToken}`);
      // === redirect user to the main page
        res.redirect("../");
      });
    });
  
  });

// === REFRESH THE EXPIRED TOKEN
auth_router.get('/refresh', (req,res)=>{
    console.log("REFRESHING TOKEN");
    const authHeader = req.headers.cookie;
    console.log(authHeader);
    const refreshToken = authHeader && authHeader.split("; ")[1].split("=")[1];
    console.log("rtoks: "+authHeader.split("; ")[1]);

    // If token is null, send error status
    if (refreshToken == null) return res.sendStatus(401);
    
    console.log(jwt.decode(refreshToken));
    
    checkRefreshToken(refreshToken, (erro, tokenCheck)=>{
      if (erro) {
        console.log(erro);
        return 0;
      }
      if(tokenCheck){
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
          if(err){ console.log("ERROOO: "+err);};
          const accessToken = generateAccessToken({ name: user.name, is_admin: user.is_admin });
          res.cookie('authorization', `${refreshToken}`);
          res.clearCookie('refreshToken');
          console.log("COOKIES:\n"+res.cookies+"\n========");
          console.log("==================\nREFRESHED COOKIE");
          console.log("==================\nREFRESHED COOKIE");
          console.log("==================\nREFRESHED COOKIE");        
          return res.redirect("../../");
        })
      }
      else {
        return res.render('error.ejs', {erro: 'No Token', redirect: '../login'
       });
      }
    
    });
    
    
  })

// === LOG OUT USER
auth_router.get('/logout', (req,res)=>{
  const authHeader = req.headers.cookie;
  const thisCookies = authHeader.split("; ");
  let refreshToken;
  if (thisCookies.length > 1) {
    refreshToken = authHeader && thisCookies[1].split("=")[1];
  }
  else{
    refreshToken = authHeader && thisCookies[0].split("=")[1];
  }
  const user = jwt.decode(refreshToken);
  
  const deleteRefToken = `DELETE FROM \`refresh_tokens\` 
               WHERE \`user_id\` = "${user.id}"`;
  db.run(deleteRefToken, function(error){
    if(error){
      console.log(error);
  };
    console.log("LOGGED OUT");
    res.redirect("../login");
  });
})

// ======================= GENERATE ACCESS TOKEN
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5s"})
}


// === GET USER FROM 'users' TABLE ON DATABASE
const  getUser  = (uname, cb) => {
  return  db.get(`SELECT * FROM users WHERE username = "${uname}"`, (err, row) => {
          cb(err, row);
          console.log("ROW: ");
          console.log(row);
  });
}

module.exports = auth_router;