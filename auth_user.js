require('dotenv').config();
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

// ============================ Log In
auth_router.post('/', async (req,res)=>{
  console.log(req.body);
    var uname = req.body.username;
    // console.log(uname);
    // console.log(req.body.password);
    var password = req.body.password;

    getUser(uname, (err, user)=>{
      if (err) return  res.status(500).send('Server error!');
      if (!user) return  res.status(404).send('User not found!');
      const  result  =  bcrypt.compareSync(password, user.password);
      if(!result) return  res.status(401).send('Password not valid!');
      const userData = { id:user.id, user:user.username,is_admin:user.is_admin };
      const accessToken  =  generateAccessToken(userData);
      const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);


      // ============================
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
        res.cookie('authorization', `${accessToken}`);
        res.cookie('refreshToken', `${refreshToken}`);
        res.redirect("../");
      });
    });

  
  
  });

  // ================== Refresh Token 
auth_router.get('/refresh', (req,res)=>{
    const authHeader = req.headers.cookie;
    const refreshToken = authHeader && authHeader.split("; ")[1].split("=")[1];
    console.log(authHeader.split("; ")[1]);
    if (refreshToken == null) return res.sendStatus(401);
    
    console.log(jwt.decode(refreshToken));
    
    if (!checkRefreshToken(refreshToken)) return res.render('error.ejs', {erro: 'No Token', redirect: '../login'});
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
      if(err){ console.log("ERROOO: "+err);};
      const accessToken = generateAccessToken({ name: user.name, is_admin: user.is_admin });
      // res.json({ accessToken: accessToken })
      res.cookie('authorization', `${refreshToken}`);
      res.redirect("../../");
      console.log("==================\nREFRESHED COOKIE");
      console.log("==================\nREFRESHED COOKIE");
      console.log("==================\nREFRESHED COOKIE");
      console.log("==================\nREFRESHED COOKIE");
      console.log("==================\nREFRESHED COOKIE");
      console.log("==================\nREFRESHED COOKIE");
    })
  })

// ======================== Logout
auth_router.get('/logout', (req,res)=>{
  const authHeader = req.headers.cookie;
  const refreshToken = authHeader && authHeader.split("; ")[1].split("=")[1];
  const user = jwt.decode(refreshToken);
  
  const deleteRefToken = `DELETE FROM \`refresh_tokens\` 
               WHERE \`token\` LIKE "${refreshToken}" AND \`user_id\` = "${user.id}"`;
  db.run(deleteRefToken, function(error){
    if(error){
      console.log(error);
  };
    res.redirect("../login");
  });
})

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5s"})
}

const checkRefreshToken = (rtoken) => {
  db.get(`SELECT * FROM \`refresh_tokens\`
                WHERE \`token\` = "${rtoken}"
                LIMIT 1`,
                function(er, row){
                  if (er){
                    console.log(er);
                    return
                  }
                  console.log(row);
                  if (row) {
                    return true;
                  }
                  return false
                });
}

const  getUser  = (uname, cb) => {
  return  db.get(`SELECT * FROM users WHERE username = "${uname}"`, (err, row) => {
          cb(err, row);
          console.log("ROW: ");
          console.log(row);
  });
}

// auth_router.listen(3000, function() {
// 	console.log("App rodando na porta 3000!");
// })

module.exports = auth_router;