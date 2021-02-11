require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
// const http = require("http");
var cookieParser = require('cookie-parser');
const db = new sqlite.Database('./data/crud.sqlite');

clients_router = express.Router();
clients_router.use(bodyParser.urlencoded({
  extended: true
}));
clients_router.use(express.json());


// ============================= See all clients ==============
clients_router.get('/', (req, res, next) => {
    db.all('SELECT * FROM `clients`;',(err, rows)=> {
      if (err) {
        throw err;
        }
        res.send(rows);
        console.log(rows);
    });
  });

  // ================= Show client registration page ==========
  clients_router.get('/register', (req, res, next) => {
    res.render('ncform.ejs');
  });

  // ============================= See one client ==============
  clients_router.get('/view/:client2view', (req, res, next) => {
    var cli = req.params.client2view;
    var emails = [];
    var phones = [];
    db.get(`SELECT * FROM \`clients\` WHERE \`id\` = ${cli};`,(err, row)=> {
      if (err) {
        throw err;
        }
        db.all(`SELECT * FROM \`emails\` WHERE \`client_id\` = ${cli};`,(er,mailrow)=>{
          if (er) {
            throw er;
          }
          var mailkeys = Object.keys(mailrow);
          for (let i = 0; i < mailkeys.length; i++) {
            emails.push(mailrow[i]['email']);            
          }
          console.log(mailrow);
          db.all(`SELECT * FROM \`phones\` WHERE \`client_id\` = ${cli};`,(er,phonerow)=>{
            if (er) {
              throw er;
            }
            var phonekeys = Object.keys(phonerow);
            for (let j = 0; j < phonekeys.length; j++) {
              phones.push(phonerow[j]['number']);
            }
            console.log(phones);
            res.render('view.ejs', {name: row.name,
              address: row.address,
              cpf: row.number,
              emails: emails,
              phones: phones});
          })
        })
        
        console.log(row);
    });
  });

  // ================= Register new client ===================
  clients_router.post('/register_client', (req, res, next) => {
    console.log(req.body);
    var address = req.body.address1 + '' + req.body.address2;
    var mails = req.body.emails.split(',');
    var phonenums = req.body.phones.split(',');
    var clientQuery = `INSERT INTO \`clients\`
                      (\`name\`,\`address\`,\`number\`)
                      VALUES
                      ("${req.body.name}","${address}","${req.body.cpf}")`;                    
    db.run(clientQuery, function(error){
        res.redirect('../');
      console.log("Registered successfully.");
      db.get(`SELECT * FROM clients WHERE name = "${req.body.name}"`, (err, this_cli) => {
        if (err) {
          console.log(err);
        }
        mails.forEach(element => {
            db.run(`INSERT INTO \`emails\`
            (\`email\`,\`client_id\`)
            VALUES
            ("${element}","${this_cli.id}")`,
            function(er){
              if(er){
                console.log(er);
              }
              else{
                phonenums.forEach(el => {
                db.run(`INSERT INTO \`phones\`
                (\`number\`,\`client_id\`)
                VALUES
                ("${el}","${this_cli.id}")`,function(ers){
                  if (ers){
                    console.log(ers);
                  }
                  else{
                    // res.redirect("../")
                  }
                });
                });
              }
            });
        }); 
      });
    });
  });

  module.exports = clients_router;