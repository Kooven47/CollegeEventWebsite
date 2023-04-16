// Libraries
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) 
{
  var mysql = require('mysql');
  var connection = require("express-myconnection");

  var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'CEWDB',
    }
  );

  var queryString = "SELECT * FROM university";
  connection.query(queryString, function(err, rows, fields) 
  {
    if (rows.length == 0)
    {
      var addUni = "INSERT INTO university (University_Name, Location, Description, Student_Population, Picture) VALUES ('University of Central Florida', 'Orlando, FL', 'The best university in Florida!', '66183', 'https://ucffoundation.org/wp-content/uploads/2021/06/UCF-Millican-Hall.jpeg');";
      connection.query(addUni, function(err, rows, fields)
      {

      });
    }
    connection.query(queryString, function(err, rows, fields)
    {
      res.render("register", {message: "", uni : rows, fullname: undefined, email: undefined, username: undefined, password: undefined, university: undefined});
    });
  });
});

module.exports = router;