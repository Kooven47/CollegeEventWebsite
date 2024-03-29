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
  var siteError = req.app.locals.site.error
  req.app.locals = { site: { error: '' } }
  if (req.session.username)
  {
    console.log("User: " + req.session.username + " logged in");
    var queryString = "SELECT *, (SELECT COUNT(*) FROM member_of WHERE RSO_ID = r1.RSO_ID) AS memberCount FROM rso AS r1 WHERE (r1.Approved = 1) AND ((SELECT University_Name FROM enrolled WHERE User_ID = '" + req.session.username + "') = (SELECT University_University_Name FROM University_has_RSO WHERE r1.RSO_ID = RSO_RSO_ID));";
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
          console.log("happening here?");
          res.render('orgs', {orgs: rows, message: siteError});
          console.log("hello!");
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

router.get('/:rsoid', function(req, res, next) {

  console.log(req.url);

  var str = req.url

  var rsoID = str.replace("/","");

  var joinStatus = 0;

  console.log(rsoID);

  if (req.session.username)
  {
    var queryMember = "SELECT * FROM member_of WHERE RSO_ID='" + rsoID + "'";
    connection.query(queryMember, function(err, rows, fields) 
    {
      console.log(rows);
      if (err) 
      { 
        console.log(err);
      }
      else
      {
        for (var i = 0; i < rows.length; i++)
        {
          if (rows[i].User_ID == req.session.username)
          {
            console.log("already a member");
            joinStatus = 1;
          }
        }  

        if (joinStatus == 0)
        {            
          console.log("join rso");  
        }    
      }
    });
    
    console.log("User: " + req.session.username + " logged in");
    var queryString = "SELECT * FROM rso WHERE RSO_ID = '" + rsoID + "'";

    setTimeout(function()
    {
      connection.query(queryString, function(err, rows, fields) 
      {
        console.log(rows);
        if (err) 
        {       
          throw err;          
        }
        else
        {
          var getNames = "SELECT name FROM user WHERE User_ID IN (SELECT User_ID FROM member_of WHERE RSO_ID = '" + rsoID + "');";
          connection.query(getNames, function(err, memberrows, fields)
          {
            console.log(memberrows);
            res.render('viewRSO', {orgs: rows, joinStatus: joinStatus, members: memberrows}); 
          });
                   
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