
const jwt = require('jsonwebtoken');
const sqlite = require('sqlite3');
const db = new sqlite.Database('./data/crud.sqlite');


const checkToken = (req,res,next) => {
    const authHeader = req.headers.cookie;
    console.log(authHeader);
    const token = authHeader && authHeader.split("; ")[0].split("=")[1];
    // === Check if token is null
    if (token == null) {
      return res.render('error.ejs', {erro: 'No Token', redirect: '../../login'});
    }
    console.log("is it ? "+JSON.stringify(jwt.decode(token)));
  
    // Checks if it's a refresh token
    if (!jwt.decode(token).exp) {
      console.log("CHECKING REFRESH TOKEN");

      checkRefreshToken(token, (error, tokenCheck)=>{
        if(error) return res.render('error.ejs', {erro: 'No Token', redirect: '../../login'});
        
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err,user) => {
            if(err){
                return res.render('error.ejs', {erro: 'Invalid Token', redirect: '../../login'})
            };
            req.user = user;
            next();      
          })
      });

    }

    // if not a refresh token, check if it's expired
    else if ((jwt.decode(token).exp) && (Date.now() >= (jwt.decode(token).exp * 1000))) {
      console.log('EXPIRED TOKEN');
      return res.redirect("../../login/refresh");
    }

    // if it's not expired, verify the token
    else {
      console.log("CHECKING FIRST COOKIE");
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
          if(err){
              // if token verification failed, send error page
              return res.render('error.ejs', {erro: 'Invalid Token', redirect: './login'})
        };
        // if token verification succeeds, proceed
        req.user = user;
          next();      
        })
    }
  };

// === FUNCTION TO VERIFY IF REFRESH TOKEN IS VALID
const checkRefreshToken = (rtoken, cb) => {
    // Check if token is on the "valid refresh 
    // tokens" table on database
    db.get(`SELECT * FROM \`refresh_tokens\`
                  WHERE \`token\` = "${rtoken}"
                  LIMIT 1`,
                  function(er, row){
                    if (er){
                      console.log(er);
                      cb("Refresh Token Invalid",false)
                    }
                    
                    if (row) {
                      console.log("rcookierow:\n");
                      console.log(row);
                      cb(null,true);
                      return               
                    }
                    cb("Refresh Token Invalid",false);
                  });
  }

module.exports = {
    checkToken: checkToken,
    checkRefreshToken: checkRefreshToken
}
