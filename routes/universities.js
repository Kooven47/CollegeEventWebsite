// Libaries
var express = require('express');
var router = express.Router();

// DB
var mysql = require('mysql');
var connection = require("express-myconnection");

// DB Connection
var connection = mysql.createConnection(
  {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'CEWDB',
  }
);

/* GET users listing. */
router.get('/', function(req, res, next) 
{
  if (req.session.username)
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
        }      
        else
        {
          res.render('universities', {message: "",unis: rows});
        }        
      });
    }, 200);
  }
  else
  {
    console.log("user not logged in");
    res.redirect('/');
  }
});

module.exports = router;