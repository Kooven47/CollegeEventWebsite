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
    var queryString = "SELECT * FROM rso AS r1 WHERE (r1.Approved = 1) AND (     (SELECT University_Name FROM enrolled WHERE User_ID='"+req.session.username+"')=(SELECT University_University_Name FROM University_has_RSO WHERE r1.RSO_ID = RSO_RSO_ID)  );";

    setTimeout(function()
    {

      connection.query(queryString, function(err, rows, fields) 
      {
          if (err) 
          {      	
          	throw err;
            //console.log(rows);
            res.render('orgs',{orgs: rows,message: ""});
          }
          	
          else
          {
            //console.log(rows);
            res.render('orgs',{orgs: rows,message: ""});
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


router.get('/:rsoid', function(req, res, next) {

  console.log(req.url);

  var str = req.url

  var rsoID = str.replace("/","");

  var joinStatus = 1;

  console.log(rsoID);



  if(req.session.username)
  {
    var queryMember = "SELECT * FROM member_of WHERE RSO_ID='"+rsoID+"'";
    connection.query(queryMember, function(err, rows, fields) 
      {
        console.log(rows);
          if (err) 
          { 
             console.log(err);
          }
          else
          {
            for(var i = 0;i < rows.length; i++)
            {
              if(rows[i].User_ID == req.session.username)
              {
                console.log("already a member");
                joinStatus = 0;

              }
            }  

            if(joinStatus == 1)            
              console.log("join rso");  
              
          }
        });
    
    console.log("User: " + req.session.username + " logged in");
    var queryString = "SELECT * FROM rso WHERE RSO_ID='"+rsoID+"'";

    setTimeout(function()
    {

      connection.query(queryString, function(err, rows, fields) 
      {
        console.log(rows);
          if (err) 
          {       
            throw err;
            //console.log(rows);
            res.render('viewRSO',{orgs: rows, joinStatus:joinStatus});          
          }
            
          else
          {
            //console.log(rows);
            res.render('viewRSO',{orgs: rows, joinStatus:joinStatus});          
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
