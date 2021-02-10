const express = require('express');
const bcrypt = require('bcrypt');
const sqlite = require('sqlite3');
const make_router = express.Router();
const fs = require('fs');
const db = new sqlite.Database('./data/crud.sqlite');

// 
const resetdb_sql = fs.readFileSync('./data/createTables.sql').toString();
const resetQueries = resetdb_sql.toString().split(';');


make_router.get('/reset',function(req, res){
    db.serialize(() => {
      db.run('BEGIN TRANSACTION;');
      resetQueries.forEach((item) => {
        if(item!="\r\n") {
          item += ';';
        //   console.log("\n---"+item);
          db.run(item, (err) => {
            if(err) console.log(err+"---"+item);
          });
        }
      });
      db.run('COMMIT;');
    });
    res.status(201).send('ok')
  });
//   console.log(resetQueries);

  make_router.get('/users', (req, res, next) => {
    db.all('SELECT * FROM `users`;',(err, rows)=> {
      if (err) {
        throw err;
        }
        res.json(rows);
        // console.log(rows);
    });
  });


  
  make_router.post('/users', async (req,res)=>{
    try {
        // const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        // console.log(salt);
        // console.log(hashedPassword);
        const user = {name: req.body.name, password: hashedPassword};
        // users.push(user);
        // console.log(req.body);
        var newRecQuery = `INSERT INTO \`users\`
                        (\`username\`,\`password\`,\`is_admin\`)
                        VALUES
                        ("${req.body.name}","${hashedPassword}",${req.body.isa})`;
        // console.log(newRecQuery);                        
        db.run(newRecQuery, function(error){
        //   res.send('ok');
        if (error) {
            throw error;
        }
        // console.log("Registered successfully.");
        res.status(201).send('ok')
        });
    }
    catch {
        res.status(500).send("oh no")
    }
});

make_router.post('/logon', async (req,res)=>{
    var uname = req.body.username;
    console.log(uname);
    console.log(req.body.password);
    db.get("SELECT * FROM users WHERE username = $name",{$name:uname},
           async(err,row)=>{
              console.log(row);
            if (row.username == null) {
                return res.status(400).send('Cannot find user')
            }
            try {
                if(await bcrypt.compare(req.body.password, row.password)){
                    res.send('Success')
                }
                else{
                res.send('Access denied')
                // console.log(await bcrypt.compare(req.body.password, row.password));
                }
            }
            catch {
                res.status(500).send()
            }
            
            });
  
  
  });

////================================================
module.exports = make_router;