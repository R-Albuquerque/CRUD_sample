const express = require('express');
const http = require("http");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var path = __dirname + '/views/user/';

auth_router = express.Router();
auth_router.use(bodyParser.urlencoded({
    extended: true
}));
auth_router.use(bodyParser.json());

auth_router.get('/', (req, res, next) => {
  res.sendFile(path + 'login.html');
});

auth_router.post('/validate',function(req, res){
      var user = req.body.user;
      var password = req.body.password;

      var body = JSON.stringify({
        "emailOrCpf": user,
        "password": password
      });
      // console.log(body);
      var auth_options = {
        hostname: "localhost",
        port: 4000,
        path: '/api/v1.0/auth',
        method: 'POST',
        headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(body),
                  'Authorization': 'auth',
                  'Accept-Encoding': 'gzip, deflate, br'
                }
              }

          var login_req = http.request(auth_options, (login_res) => {

            // console.log('statusCode:', login_res.statusCode);
            // console.log('headers:', login_res.headers);
            // console.log(login_res);

            login_res.on('data', (d) => {

                // console.log(`BODY: ${d}`);
                res.cookie('token', `${JSON.parse(d).data.token}`,{maxAge: 3600000});
                res.redirect('../');

            });
            login_res.on('end', () => {

                // console.log("NO MORE DATA'");

            });
          });

          login_req.on('error', (e) => {
            res.send(e);
          });

          login_req.write(body);
          login_req.end();

  });

module.exports = auth_router;