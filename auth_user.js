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

auth_router.get('/', (req,res)=>{
  res.render('login.ejs');
})

auth_router.post('/', async (req,res)=>{
  console.log(req.body);
    var uname = req.body.username;
    console.log(uname);
    console.log(req.body.password);
    var password = req.body.password;
    // var userData = getUser(uname);

    getUser(uname, (err, user)=>{
      if (err) return  res.status(500).send('Server error!');
      if (!user) return  res.status(404).send('User not found!');
      const  result  =  bcrypt.compareSync(password, user.password);
      if(!result) return  res.status(401).send('Password not valid!');

      const  accessToken  =  jwt.sign({ id:  user.id }, process.env.ACCESS_TOKEN_SECRET);
      res.cookie('authorization', `${accessToken}`,{maxAge: 3600000});
      // res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  3600000});
      res.redirect("../");
    });

  
  
  });

const  getUser  = (uname, cb) => {
  return  db.get(`SELECT * FROM users WHERE username = "${uname}"`, (err, row) => {
          cb(err, row)
  });
}



module.exports = auth_router;