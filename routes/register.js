var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {


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
  //res.sendFile("../views/index.ejs");
  var queryString = "SELECT * FROM university";
  connection.query(queryString, function(err, rows, fields) 
  {
    res.render("register",{message: "",uni : rows});  
  });
});



module.exports = router;
