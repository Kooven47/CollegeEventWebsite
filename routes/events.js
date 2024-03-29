// Libraries
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
    console.log(req.url);
    var queryUser = "SELECT * FROM enrolled WHERE User_ID = '" + req.session.username +"';";

    var university;

    connection.query(queryUser, function(err, rows, fields) 
    {
      if (err) 
      {       
        console.log(err);
      }            
      else
      {
        university = rows[0];

        console.log("Rows: " + rows);
      }          

      console.log("User: " + req.session.username + " logged in");
      var queryString = "SELECT DISTINCT *, (SELECT rso.name FROM hosts JOIN rso ON hosts.RSO_RSO_ID = rso.RSO_ID WHERE E1.Event_ID = hosts.Event_ID) AS hostRso FROM event AS E1 WHERE approved = 1 AND Level = 0 OR (University_Name = '" + university.University_Name + "' AND Level = 1) OR (Level = 2 AND ((SELECT RSO_RSO_ID FROM hosts WHERE E1.Event_ID = Event_ID) = ANY(SELECT RSO_ID FROM member_of WHERE User_ID = '" + req.session.username + "')));";               // check later
      
      console.log(queryString);

      var RSOString = "SELECT * FROM rso WHERE Admin = '" + req.session.username + "';";
      setTimeout(function()
      {
        console.log(university.University_Name);

        if (req.url == "/?selection=Private")
        {
          queryString = "SELECT *, (SELECT rso.name FROM hosts JOIN rso ON hosts.RSO_RSO_ID = rso.RSO_ID WHERE E1.Event_ID = hosts.Event_ID) AS hostRso FROM event as E1 WHERE University_Name = '" + university.University_Name + "' AND Level = 1;";
          console.log("filter:private");
        }    
        else if (req.url == "/?selection=RSO")
        {
          queryString = "SELECT DISTINCT *, (SELECT rso.name FROM hosts JOIN rso ON hosts.RSO_RSO_ID = rso.RSO_ID WHERE E1.Event_ID = hosts.Event_ID) AS hostRso FROM event AS E1 WHERE ((SELECT RSO_RSO_ID FROM hosts WHERE E1.Event_ID = Event_ID) = ANY(SELECT RSO_ID FROM member_of WHERE User_ID = '" + req.session.username + "')) AND LEVEL = 2;";
          console.log("filter:rso");
        }    
        else if (req.url == "/?selection=Public")
        {
          queryString = "SELECT * FROM event WHERE approved = 1 AND Level = 0";
          console.log("filter:public");
        }
        else if (req.url == "/?selection=All")
        {
          queryString = "SELECT DISTINCT *, (SELECT rso.name FROM hosts JOIN rso ON hosts.RSO_RSO_ID = rso.RSO_ID WHERE E1.Event_ID = hosts.Event_ID) AS hostRso FROM event AS E1 WHERE approved = 1 AND Level = 0 OR (University_Name = '" + university.University_Name + "' AND Level = 1) OR (Level = 2 AND ((SELECT RSO_RSO_ID FROM hosts WHERE E1.Event_ID = Event_ID) = ANY(SELECT RSO_ID FROM member_of WHERE User_ID = '" + req.session.username + "')));";
          console.log("filter:all");
        }
        console.log(queryString + " right before connection");
        connection.query(queryString, function(err, erows, fields) 
        {
          console.log(queryString);
          if (err) 
          {       
            throw err;          
          }          
          else
          {
            connection.query(RSOString, function(err, rows, fields) 
            {
              console.log("message: " + siteError);
              res.render("events", {message: siteError, events: erows, RSO:rows, uni: university.University_Name});  
            });             
          }          
        });
      }, 200); 
    });
  }
  else
  {
    console.log("user not logged in");
    res.redirect('/');
  }
});

/* GET users listing. */
router.get('/:eventid', function(req, res, next) 
{
  console.log(req.url);

  var str = req.url

  var eventid = str.replace("/","");

  console.log(eventid);

  if (req.session.username)
  {
    console.log("User: " + req.session.username + " logged in");
    
    setTimeout(function()
    { 
      var queryComments = "SELECT * FROM comments WHERE Event_ID = '"+ eventid + "';";
      var coms;

      connection.query(queryComments, function(err, rows, fields) 
      {
        if (err)
        { 
          throw err;
        }                   
        else
        {
          coms = rows;
        }
      });

      setTimeout(function()
      { 

        console.log("COMS: " + coms);
      }, 200);

      var queryEvent = "SELECT * FROM event WHERE Event_ID='" + eventid + "'";

      connection.query(queryEvent, function(err, rows, fields) 
      {
        console.log(rows);
        console.log("COMS: " + JSON.stringify(coms));
        if (err) 
        {       
          throw err;        
        }   
        else
        {
          res.render('viewEvent', {events: rows,comments: coms, currentUser: req.session.username});          
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