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
              cpf: row.number_cpf,
              emails: emails,
              phones: phones,
              country: row.country,
              state: row.state,
              city: row.city,
              cep: row.zip,
              is_admin: decodedToken.is_admin,
              user_token: token
            });
          })
        })
    });//end of db.get()
  });

  // ================= Register new client ===================
  clients_router.post('/register_client', (req, res, next) => {
    console.log(req.body);

    const authHeader = req.headers.cookie;
    const token = authHeader && authHeader.split("; ")[0].split("=")[1];
    const decodedToken = jwt.decode(token);

    var address = req.body.address1 + '[=' + req.body.address2;
    var mails = req.body.emails.split(',');
    var phonenums = req.body.phones.split(',');
    var client_cpf = parseInt((req.body.cpf).replace(/\./g,"").replace(/\-/g,''));
    console.log(typeof client_cpf);
    var clientQuery = `INSERT INTO \`clients\`
                      (\`name\`,\`address\`,\`country\`,\`state\`,\`city\`,\`zip\`,\`number_cpf\`,\`creator_id\`,\`creator_username\`)
                      VALUES
                      ("${req.body.name}","${address}","${req.body.country}","${req.body.state}","${req.body.city}","${req.body.cep}",${client_cpf},${decodedToken.id},"${decodedToken.user}")`;                    
    //TO REMEMBER:
    // The following database operations need serious improving.
    // Maybe serialize them?
    db.run(clientQuery, function(error){
      if (error) {
        console.log(error);
        return res.render('error.ejs', {erro: 'Error on client registration', redirect: '../../'})
      };
      db.get(`SELECT * FROM clients WHERE name = "${req.body.name}"`, (err, this_cli) => {
        if (err) {
          console.log(err);
        }
        var is_ok = true;

        for (let i = 0; i < mails.length; i++) {
          if (!is_ok) {
            console.log("===>NOT OK<===");
            break;
          }
          db.run(`INSERT INTO \`emails\`
          (\`email\`,\`client_id\`)
          VALUES
          ("${mails[i]}","${this_cli.id}")`,
          function(er){
              if (er){
                  is_ok = false;
                  console.log(er);
                  return 0
                  };
          });   
      }
  
      for (let index = 0; index < phonenums.length; index++) {
          if (!is_ok) {
            console.log("===>NOT OK<===");
              break;
          }
          db.run(`INSERT INTO \`phones\`
          (\`number\`,\`client_id\`)
          VALUES
          ("${phonenums[index]}","${this_cli.id}")`,function(ers){
              if (ers){
                  is_ok = false;
                  console.log(er);
                  return 0
                  };
          });
          
      }
      if (!is_ok) {
        console.log("===>NOT OK<===");
      }
      });
      res.redirect('../');
      console.log("Registered successfully.");
    });

  });

   // ================= Client edit form ===================
   clients_router.get('/edit/:client2edit',checkToken, (req, res, next) => {
    console.log(req.body);

    const cli = req.params.client2edit;
    var emails = [];
    var phones = [];

    const authHeader = req.headers.cookie;
    const token = authHeader && authHeader.split("; ")[0].split("=")[1];
    const decodedToken = jwt.decode(token);
    var is_admin = decodedToken.is_admin;
    
    if (is_admin == 1) {
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
              res.render('edit.ejs', {
                client_id: row.id,
                name: row.name,
                address: row.address,
                country: row.country,
                state: row.state,
                city: row.city,
                cpf: row.number_cpf,
                cep: row.zip,
                emails: emails,
                phones: phones,
                is_admin: decodedToken.is_admin,
                user_token: token
              });
            })
          })
      });//end of db.get()
    } // end if(is_admin == 1)
    else {
      res.redirect('../');
    }

  });

   // ================= Edit new client post ===================
   clients_router.post('/edit/:client2edit',checkToken, (req, res, next) => {
    console.log(req.body);

    const cli = req.params.client2edit;
    var emails = [];
    var phones = [];

    const authHeader = req.headers.cookie;
    const token = authHeader && authHeader.split("; ")[0].split("=")[1];
    const decodedToken = jwt.decode(token);
    var is_admin = decodedToken.is_admin;
    
    if (is_admin == 1) {
      
      //REMEMBER to work on this:
      db.get(`SELECT * FROM \`clients\` WHERE \`id\` = ${cli};`,(err, row)=> {
        if (err) {
          throw err;
          }
      });

    } // end if(is_admin == 1)

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