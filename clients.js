require('dotenv').config();
const { checkToken } = require('./checkTokens.js');
const express = require('express');
const bodyParser = require("body-parser");
const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
// const http = require("http");
var cookieParser = require('cookie-parser');
const db = new sqlite.Database('./data/crud.sqlite');
// const home_path = __dirname;

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
        // console.log(rows);
    });
  });

  // ================= Show client registration page ==========
  clients_router.get('/register', (req, res, next) => {
    res.render('ncform.ejs');
  });

  // ============================= See one client ==============
  clients_router.get('/view/:client2view',checkToken, (req, res, next) => {

    const authHeader = req.headers.cookie;
    const token = authHeader && authHeader.split("; ")[0].split("=")[1];
    const decodedToken = jwt.decode(token);
    console.log("DECODED:");
    console.log(decodedToken);
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
          db.all(`SELECT * FROM \`phones\` WHERE \`client_id\` = ${cli};`,(er,phonerow)=>{
            if (er) {
              console.log(er);;
            }
            if (row == undefined) {
              return res.render('error.ejs', {erro: 'Client not found', redirect: '../../'})
            }
            var phonekeys = Object.keys(phonerow);
            for (let j = 0; j < phonekeys.length; j++) {
              phones.push(phonerow[j]['number']);
            }
            res.render('view.ejs', {
              client_id: row.id,
              name: row.name,
              address: row.address,
              cpf: row.number,
              emails: emails,
              phones: phones,
              is_admin: decodedToken.is_admin,
              user_token: token
            });
          })
        })
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
    //TO REMEMBER:
    // The following database operations need serious improving.
    // Maybe serialize them?
    db.run(clientQuery, function(error){
      if (error) return res.render('error.ejs', {erro: 'Error on client registration', redirect: '../../'});
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
      res.redirect('../');
      console.log("Registered successfully.");
    });

  });

// === DELETE A CLIENT
clients_router.post('/delete_client', (req, res, next) => {
    // Check if the user requesting the deletion is admin
    var is_admin = jwt.decode(req.body.user_token).is_admin;
    if (is_admin == 1) {

      // Delete from client, email and phone tables all registers of the client
      db.serialize(() => {

        db.run('BEGIN TRANSACTION;');
        db.run(`DELETE FROM \`clients\` 
        WHERE \`id\` = "${req.body.client_id}"`, (err) => {
          if(err) console.log(err);
        });
        db.run(`DELETE FROM \`emails\` 
        WHERE \`client_id\` = "${req.body.client_id}"`, (err) => {
          if(err) console.log(err);
        });
        db.run(`DELETE FROM \`phones\` 
        WHERE \`client_id\` = "${req.body.client_id}"`, (err) => {
          if(err) console.log(err);
        });
        db.run('COMMIT;');

      });
      // Send a message that deletion was successful
      console.log("Deleted");
      res.json({message: "Deleted!"})

    }

    // If the user trying to delete from database is not admin:
    else{
      res.json({message: "Not Authorized"});
    }

  });

  module.exports = clients_router;