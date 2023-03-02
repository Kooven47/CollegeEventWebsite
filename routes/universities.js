var express = require('express');
var router = express.Router();


var mysql = require('mysql');
var connection = require("express-myconnection");

var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'mydb',
    }
);

/* GET users listing. */
router.get('/', function(req, res, next) {


  if(req.session.username)
  {
    console.log("User: " + req.session.username + " logged in");
    var queryString = "SELECT * FROM university";

    setTimeout(function()
    {
      connection.query(queryString, function(err, rows, fields) 
      {
          if (err) 
          {       
            throw err;
            //console.log(rows);
            res.render('universities',{message: "",unis: rows});
          }
            
          else
          {
            //console.log(rows);
            res.render('universities',{message: "",unis: rows});
          }
            
      });
    },200);
  }
  else
  {
    console.log("user not logged in");
    res.redirect('/');
  }

  


  
  
});

module.exports = router;
