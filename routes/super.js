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
    var queryString = "SELECT * FROM rso WHERE Approved = 0";
    var equery = "SELECT * FROM event WHERE approved = 0;";

    setTimeout(function()
    {
      connection.query(equery, function(err,erows,fields)
      {
        if(err)throw err;
      
      connection.query(queryString, function(err, rows, fields) 
      {
          if (err) 
          {       
            throw err;
            //console.log(rows);
            res.render('super',{message: "",orgs: rows, events: erows});
          }
            
          else
          {
            //console.log(rows);
            res.render('super',{message: "",orgs: rows, events: erows});
          }
            
      });


    });

    },200);
  }
  else
  {
    console.log("user not logged in");
    res.redirect('/');
  }




  router.get('/RSO/:orgsid', function(req, res, next) {

  console.log(req.url);

  var str = req.url

  var rsoid = str.replace("/RSO/","");

  console.log(rsoid);



  if(req.session.username)
  {
    var findSuper = "SELECT COUNT(*) AS TOTAL FROM Super_Admin WHERE User_ID = '"+req.session.username+"';";
    connection.query(findSuper, function(err, superrows, fields){

      if(superrows[0].TOTAL > 0){
          console.log("User: " + req.session.username + " logged in");
          var appQuery = "UPDATE rso SET Approved = 1 WHERE RSO_ID = '"+rsoid+"';";


                  var findAdmin = "SELECT * FROM rso WHERE RSO_ID = '"+rsoid+"';";
                  connection.query(findAdmin, function(err, arows, fields){


                      var appAdmin = "INSERT Admin (User_ID) VALUES ('"+arows[0].Admin+"');";

                      connection.query(appAdmin, function(err, rows, fields){
                      });

                  });

          connection.query(appQuery, function(err, rows, fields){
              console.log("Updating Event with query: "+appQuery);
          });
        }
        else{
        }

    });
    res.redirect('/super');

    
  }
  else
  {
    console.log("user not logged in");
    res.redirect('/');
  }

  
  
});





  router.get('/Event/:eventid', function(req, res, next) {

  console.log(req.url);

  var str = req.url

  var eventid = str.replace("/Event/","");

  console.log("Event ID is : "+eventid);


  if(req.session.username)
  {
     var findSuper = "SELECT COUNT(*) AS TOTAL FROM Super_Admin WHERE User_ID = '"+req.session.username+"';";
    connection.query(findSuper, function(err, superrows, fields){

      if(superrows[0].TOTAL > 0){
            console.log("User: " + req.session.username + " logged in");
            var appQuery = "UPDATE Event SET approved = 1 WHERE Event_ID = '"+eventid+"';";
            connection.query(appQuery, function(err, rows, fields){
                console.log("Updating Event with query: "+appQuery);
            });
      }
      else{}
    });

    res.redirect('/super');

    
  }
  else
  {
    console.log("user not logged in");
    res.redirect('/');
  }

  
  
});


  
  
});

module.exports = router;
