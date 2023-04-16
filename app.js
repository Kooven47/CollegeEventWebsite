// Libraries
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var md5 = require('blueimp-md5');

// Routes
var index = require('./routes/index');
var register = require('./routes/register');
var events = require('./routes/events');
var orgs = require('./routes/orgs');
var universities = require('./routes/universities');
var superA = require('./routes/super');

// DB
var mysql = require('mysql');
var connection = require("express-myconnection");

// Express
var app = express();
 
// DB connection
var connection = mysql.createConnection(
  {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'CEWDB',
  }
);

// Session
app.use(session({
  secret            : "hello TA",
  saveUninitialized : true,
  resave            : true,
  name              : "",
  username          : "",
  password          : "",
  type              : ""
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Favicon setup and logger
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie parser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);
app.use('/register', register);
app.use('/events', events);
app.use('/orgs', orgs);
app.use('/universities', universities);
app.use('/super', superA);

// Homepage: sign in
app.post('/', function(req, res, next) 
{
  // Check for any empty fields
  if (!req.body.username && !req.body.password) {res.render("index", {message: "* Please enter your username and password *", username: undefined, password: undefined}); return;}
  if (!req.body.username) {res.render("index", {message: "* Please enter your username *", username: undefined, password: req.body.password}); return;}
  if (!req.body.password) {res.render("index", {message: "* Please enter your password *", username: req.body.username, password: undefined}); return;}

  var queryString = "SELECT * FROM user WHERE User_ID = '" + req.body.username + "'";
  var currUser = {username: req.body.username, password: md5(req.body.password)};

  connection.query(queryString, function(err, rows, fields) 
  {
    // Check if there is a database error
    if (err)
    {
      res.render("index", {message: "* database error *", username: undefined, password: undefined}); return;
    }
    // Check if username and password match
    else if (rows != "")
    {
      if (rows[0].User_ID == currUser.username && rows[0].password == currUser.password)
      {
        req.session.username = req.body.username;
        req.session.password = req.body.password;

        res.redirect("events");
      }
      // Username and password do not match
      else
      {
        res.render("index", {message: "* Username or password is incorrect *", username: req.body.username, password: req.body.password});
      }
    }
    // Username and password do not match
    else
    {
      res.render("index", {message: "* Username or password is incorrect *", username: req.body.username, password: req.body.password});
    }
  });
});

// Sign up page
app.post('/register', function(req, res, next) 
{
  // Check for password requirements with regex
  // One lowercase, one uppercase, one digit, one special character, 6-128 characters
  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&-+=()!?_ "]).{6,128}$/;

  // Create new user object
  var newUser = 
  {
    name     : req.body.name,
    username : req.body.username,
    password : md5(req.body.password),
    type     : req.body.type,
    level    : 0,
    email    : req.body.email
  };

  // Set user level
  if (newUser.type == "Student") {newUser.level = 0;}
  else if (newUser.type == "superAdmin") {newUser.level = 2;}

  var checkquery = "SELECT COUNT(*) AS User_ID FROM user WHERE User_ID = '" + req.body.username + "' OR email = '" + req.body.email + "';";
  var regins1 = "INSERT INTO User (User_ID, name, password, level, email) VALUES ('" + newUser.username + "','" + newUser.name + "','" + newUser.password + "','" + newUser.level + "','" + newUser.email + "');";
  var regins2 = "INSERT INTO Student (User_ID) VALUES ('" + newUser.username + "');";
  var regins3 = "INSERT INTO Super_Admin (User_ID) VALUES ('" + newUser.username + "');";
  var enrollquery = "INSERT INTO enrolled (User_ID, University_Name) VALUES ('" + req.body.username + "','" + req.body.uni + "');";

  connection.query(checkquery, function(err, rows, fields) 
  {
    if (err) 
    {
      console.error(err);
      return;
    }
    else
    {
      // Check for empty fields
      if (req.body.name == "" || req.body.username == "" || req.body.password == "" || req.body.email == "")
      {
        var queryString = "SELECT * FROM university";
        connection.query(queryString, function(err, rows, fields) 
        {
          res.render("register", {message: "* Please fill out all the fields *", uni: rows, fullname: req.body.name, email: req.body.email, username: req.body.username, password: req.body.password, university: req.body.university});  
        });
      }
      // Check that a university is selected
      else if (req.body.uni == "UNIVERSITY") 
      {
        var queryString = "SELECT * FROM university";
        connection.query(queryString, function(err, rows, fields) 
        {
          res.render("register", {message: "* Please select a university *", uni: rows, uni: rows, fullname: req.body.name, email: req.body.email, username: req.body.username, password: req.body.password, university: req.body.university});  
        });
        return;
      }
      // Check if password meets requirements
      else if (!regex.test(req.body.password))
      {
        var queryString = "SELECT * FROM university";
        connection.query(queryString, function(err, rows, fields) 
        {
          res.render("register", {message: "* Password does not meet requirements *", uni: rows, uni: rows, fullname: req.body.name, email: req.body.email, username: req.body.username, password: req.body.password, university: req.body.university});  
        });
      }
      else if (rows[0].User_ID == 0)
      {
        connection.query(regins1, function(err, rows, fields) 
        {
          if (err) 
          {
            throw err;
          }
        });

        if (newUser.level == 0)
        {
          connection.query(regins2, function(err, rows, fields) 
          {
            if (err) 
            {
              throw err;
            } 
          });

          req.session.name = req.body.name;
          req.session.username = req.body.username;
          req.session.password = req.body.password;
          req.session.type = req.body.type;
          
          connection.query(enrollquery,function(err,rows,fields)
          {
            if(err) 
            {
              throw err;
            }
          });

          console.log("New user added");

          setTimeout(function()
          {
            res.redirect("events");
          }, 200);         
        }
        else if (newUser.level == 2)
        {
          connection.query(regins3, function(err, rows, fields) 
          {
            if (err) 
            {
              throw err;
            }
            connection.query(enrollquery,function(err, rows, fields)
            {
              if (err) 
              {
                throw err;
              }
            });
          });

          req.session.name = req.body.name;
          req.session.username = req.body.username;
          req.session.password = req.body.password;
          req.session.type = req.body.type;
      
          console.log("New user added");

          res.redirect("events");
        }    
      }
      else
      {
        console.log("* This username is taken *"); 
        var queryString = "SELECT * FROM university";
        connection.query(queryString, function(err, rows, fields) 
        {
          res.render("register", {message: "* This username or email is taken *", uni: rows, uni: rows, fullname: req.body.name, email: req.body.email, username: req.body.username, password: req.body.password, university: req.body.university});  
        });
      }
    }
  });
});

app.post('/events', function(req, res, next) 
{
  var perm;

  if (req.body.type == "pub")
  {
    console.log("Perm: public");
    perm = 0;
    var addEvent1 = "INSERT INTO event (Name, Description, startTime, endTime, Location, Latitude, Longitude, Phone, Email, Level, approved) VALUES ('" + req.body.name + "','" + req.body.description + "','" + req.body.startTime + "','" + req.body.endTime + "','" + req.body.location + "','"+req.body.latitude + "','" + req.body.longitude + "','" + req.body.phone + "','" + req.body.email + "','" + perm+"', 0);";
  }
    
  else if (req.body.type == "priv")
  {
    console.log("Perm: private");
    perm = 1;
    var addEvent1 ="INSERT INTO event (Name, Description, startTime, endTime, Location, Latitude, Longitude, Phone, Email, Level, approved, University_Name) VALUES ('" + req.body.name + "','" + req.body.description + "','" + req.body.startTime + "','" + req.body.endTime + "','" + req.body.location + "','" + req.body.latitude + "','" + req.body.longitude + "','" + req.body.phone + "','" + req.body.email + "','" + perm + "', 1,'" + req.body.uni + "');";
  }
    
  else if (req.body.type == "org")
  {
    console.log("Perm: rso");
    perm = 2;
    var addEvent1 ="INSERT INTO event (Name, Description, startTime, endTime, Location, Latitude, Longitude, Phone, Email, Level, approved, University_Name) VALUES ('" + req.body.name + "','" + req.body.description + "','" + req.body.startTime + "','" + req.body.endTime + "','" + req.body.location + "','" + req.body.latitude + "','" + req.body.longitude + "','" + req.body.phone + "','" + req.body.email + "','" + perm + "', 1,'" + req.body.uni + "');";
  }
  
  var checkadmin = "SELECT COUNT (*) AS TOTAL FROM admin WHERE User_ID ='" + req.session.username + "';";
  var getRSO = "SELECT * FROM rso WHERE admin = '" + req.session.username + "' AND Name = '" + req.body.RSO + "';";

  var lastEvent = "SELECT LAST_INSERT_ID() AS LE;";
  var checkOverlap = "SELECT * FROM event WHERE startTime <= '" + req.body.endTime + "' AND endTime >= '" + req.body.startTime + "' AND approved = 1 AND location = '" + req.body.location + "';";

  var LID;

  connection.query(checkOverlap, function(err, rows, fields) 
    {
      if(rows[0] != null)
      {
        app.locals.site.error = "* There is already an event at this location during this time! *"
        res.render("events", {message: "* There is already an event at this location during this time! *", events: undefined, RSO:undefined, uni: undefined}); 
        return;
      }
    else{
  connection.query(checkadmin, function(err, rows, fields) 
  {
    
      if (rows[0].TOTAL > 0)
      {
        connection.query(addEvent1, function(err, rows, fields) 
        {
          
            connection.query(lastEvent, function(err, rows, fields)
            {
              LID = rows[0].LE;
              console.log(LID);
          
              connection.query(getRSO, function(err, rsorows, fields)
              {
                if (req.body.type == "org"){
                  if (!(rsorows && rsorows.length > 0)) {
                    app.locals.site.error = "* Must select an RSO *"
                    res.render("events", {message: "* Must select an RSO *", events: undefined, RSO:rsorows, uni: undefined}); 
                  }
                  else{
                    var rsoHosts = "INSERT INTO hosts (RSO_RSO_ID, Event_ID) VALUES ('" + rsorows[0].RSO_ID + "','" + LID + "')"; 
                    connection.query(rsoHosts,function(err,rows,fields)
                    {
  
                    });
                  }
                }
              });
            });
        });
      }
      else
      {
        console.log("%%%%%%%%%%%%%%% in");
        if (perm == 0)
        {
          console.log("****************public");
          var addEvent0 = "INSERT INTO event (Name, Description, startTime, endTime, Location, Latitude, Longitude, Phone, Email, Level, approved) VALUES ('" + req.body.name + "','" + req.body.description + "','" + req.body.startTime + "','" + req.body.endTime + "','" + req.body.location + "','" + req.body.latitude + "','" + req.body.longitude + "','" + req.body.phone + "','" + req.body.email + "','" + perm + "', 0);";
        
          connection.query(addEvent0, function(err, rows, fields) 
          {
            
            connection.query(lastEvent, function(err, rows, fields)
            {
              LID = rows[0].LE;
              console.log(LID);
          
              connection.query(getRSO, function(err, rsorows, fields)
              {      
                if (req.body.type == "org"){
                  if (!(rsorows && rsorows.length > 0)) {
                    app.locals.site.error = "* Must select an RSO *"
                    res.render("events", {message: "* Must select an RSO *", events: undefined, RSO:rsorows, uni: undefined}); 
                  }
                  else{
                    var rsoHosts = "INSERT INTO hosts (RSO_RSO_ID, Event_ID) VALUES ('" + rsorows[0].RSO_ID + "','" + LID + "')";
            
                    connection.query(rsoHosts,function(err,rows,fields)
                    {
  
                   });
                  }
                }
              });
            });
          });
        }
        else if (perm == 1)
        {
          console.log("*******************uni: " + req.body.uni);
          var addEvent0 = "INSERT INTO event (Name, Description, startTime, endTime, Location, Latitude, Longitude, Phone, Email, Level, approved, University_Name) VALUES ('"+ req.body.name + "','" + req.body.description + "','" + req.body.startTime + "','" + req.body.endTime + "','" + req.body.location + "','" + req.body.latitude+"','" + req.body.longitude + "','" + req.body.phone + "','" + req.body.email + "','" + perm + "', 1,'" + req.body.uni + "');";
        
          connection.query(addEvent0, function(err, rows, fields) 
          {
            
            connection.query(lastEvent, function(err, rows, fields)
            {
              LID = rows[0].LE;
              console.log(LID);
          
              connection.query(getRSO, function(err, rsorows, fields)
              {
                if (req.body.type == "org"){
                  if (!(rsorows && rsorows.length > 0)) {
                    app.locals.site.error = "* Must select an RSO *"
                    res.render("events", {message: "* Must select an RSO *", events: rows, RSO:rsorows, uni: undefined}); 
                  }
                  else{              
                    var rsoHosts = "INSERT INTO hosts (RSO_RSO_ID, Event_ID) VALUES ('" + rsorows[0].RSO_ID + "','" + LID + "')";           
                    connection.query(rsoHosts,function(err,rows,fields)
                    {
  
                    });
                  }
                }
              });
            });
          });
        }
        else if (perm == 2)
        {
          var addEvent0 = "INSERT INTO event (Name, Description, startTIme, endTime, Location, Latitude, Longitude, Phone, Email, Level, approved, University_Name) VALUES ('" + req.body.name + "','" + req.body.description + "','" + req.body.startTime + "','" + req.body.endTime + "','" + req.body.location + "','" + req.body.latitude+"','" + req.body.longitude + "','" + req.body.phone + "','" + req.body.email + "','" + perm + "', 1,'" + req.body.uni + "');";

          connection.query(addEvent0, function(err, rows, fields) 
          {
            
            connection.query(lastEvent, function(err, rows, fields)
            {
              LID = rows[0].LE;
              console.log(LID);
              
              connection.query(getRSO, function(err, rsorows, fields)
              {
  
                if (req.body.type == "org"){
                  if (!(rsorows && rsorows.length > 0)) {
                    app.locals.site.error = "* Must select an RSO *"
                    console.log(app.locals.site.error);                  
                  }
                  else{
                    var rsoHosts = "INSERT INTO hosts (RSO_RSO_ID, Event_ID) VALUES ('" + rsorows[0].RSO_ID + "','" + LID + "')";
                
                    connection.query(rsoHosts,function(err,rows,fields)
                    {
                    
                    });
                  }
                }
              });
            });
          });
          console.log("rso");
        }
      }
  });}
});
  console.log(req.body);
  res.redirect('/events');
});

/* GET users listing. */
app.post('/events/:eventid', function(req, res, next) 
{
  console.log(req.url);

  var str = req.url

  var eventid = str.replace("/events/","");

  console.log(eventid);

  console.log(req.session.username);

  console.log(req.body);

  var rating;

  rating = req.body.rating;

  var addEventComment = "INSERT INTO comments (Event_ID, owner, commentString, rating) VALUES ('" + eventid + "', '" + req.session.username + "','" + req.body.comments + "','" + rating + "');";
  var comment_id;
  var lastComment = "SELECT LAST_INSERT_ID() AS Last;"
  connection.query(addEventComment, function(err, rows, fields) 
  {
    if (err) 
    {
      console.error(err);
      return;
    }
    console.log(req.session.username + " is currently adding comm");
    connection.query(lastComment, function(err, lastrows, fields)
    {
      comment_id = lastrows[0].Last;

      var addHasComment = "INSERT INTO event_has_comments (Event_Event_ID, comments_id) VALUES ('" + eventid + "', '" + comment_id + "');"
      connection.query(addHasComment, function(err, comrows, fields)
      {
        if(err)
        {
          console.error(err);
          return;
        }
      });
    });
  });

  res.redirect(req.get('referer'));
});

/* GET users listing. */
app.post('/deletecomment/:id', function(req, res, next) 
{
  console.log("********* START **********");

  console.log(req.url);

  var str = req.url

  var eventid = str.replace("/deletecomment/","");

  console.log(eventid);

  console.log(req.session.username);

  console.log(req.body);

  console.log("********* END **********");

  var delEventComment = "DELETE FROM comments WHERE id =" + eventid + ";";
  var checkowner = "SELECT * FROM comments WHERE id = " + eventid + ";"

  connection.query(checkowner,function(err, rows, fields)
  {
    if (req.session.username == rows[0].owner)
    {
      console.log("deleting comm");
      connection.query(delEventComment, function(err, rows, fields) 
      {
        if (err) 
        {
          console.error(err);
          return;
        }
      });
    }
    res.redirect(req.get('referer'));
	});
});

app.post('/modifycomment/:id', function(req, res, next) 
{
  console.log("********* START **********");

  console.log(req.url);

  var str = req.url

  var eventid = str.replace("/modifycomment/","");

  console.log(eventid);

  console.log(req.session.username);

  console.log(req.body);

  console.log("********* END **********");

  var modEventComment = "UPDATE comments SET commentString = '" + req.body.comments + "' WHERE id = " + eventid + ";";
  var checkowner = "SELECT * FROM comments WHERE id = " + eventid + ";"

  connection.query(checkowner,function(err, rows, fields)
  {
    if (req.session.username == rows[0].owner)
    {
      connection.query(modEventComment, function(err, rows, fields) 
      {
        if (err) 
        {
          console.error(err);
          return;
        }
      });
    }
    console.log("here2");
    res.redirect(req.get('referer'));
	});
});

app.post('/orgs', function(req, res, next) 
{
  console.log("******  START ORG  ******");

  var adminEmail = req.body.adminEmail;
  var user2Email = req.body.user2Email;
  var user3Email = req.body.user3Email;
  var user4Email = req.body.user4Email;
  var user5Email = req.body.user5Email;

  var adminUserID;
  var findadmin = "SELECT * FROM user WHERE email = '" + req.body.adminEmail + "';"

  connection.query(findadmin, function(err, rows, fields) 
  {
    if (err) 
    {
      console.error(err);
      return;
    }

    if (rows.length == 0)
    {
      console.log("admin email not found");
      app.locals.site.error = "admin email not found"
      return res.render('orgs', {orgs: rows, message: "admin email not found"});
    }

    console.log("here");
    adminUserID = rows[0].User_ID;
    console.log("admin is " + adminUserID);

    adminEmailDomain = adminEmail.replace(/.*@/, "");
    user2EmailDomain = user2Email.replace(/.*@/, "");
    user3EmailDomain = user3Email.replace(/.*@/, "");
    user4EmailDomain = user4Email.replace(/.*@/, "");
    user5EmailDomain = user5Email.replace(/.*@/, "");
    console.log(adminEmailDomain);
    console.log(user2EmailDomain);
    console.log(user3EmailDomain);
    console.log(user4EmailDomain);
    console.log(user5EmailDomain);
  
    console.log("******  END ORG  ******");
    console.log(req.body);
  
    var queryString = "SELECT * FROM rso";
    
    connection.query(queryString, function(err, rows, fields) 
    {
      if (err) 
      {       
        throw err;
      }

      if (!((adminEmailDomain == user2EmailDomain) && (adminEmailDomain == user3EmailDomain) && (adminEmailDomain == user4EmailDomain) && (adminEmailDomain == user5EmailDomain)))
      {
        console.log("email domains don't match");
        app.locals.site.error = "email domains don't match"
        return res.render('orgs', {orgs: rows, message: "email domains don't match or don't exist"});
      }    
      console.log("emails match");
      
      [user2Email, user3Email, user4Email, user5Email].forEach(function(email)
      {
        var queryString = "SELECT * FROM user WHERE email = '" + email + "';";
        connection.query(queryString, function(err, rows, fields) 
        {
          if (err) 
          {
            console.error(err);
            return;
          }
    
          if (rows.length == 0)
          {
            console.log("email " + email + " not found");
            app.locals.site.error = "email not found";
            return res.render('orgs', {orgs: rows, message:"email not found"});
          }
        });
      });

      var addOrg = "INSERT INTO rso (Name, Admin, Approved, Active) VALUES ('" + req.body.name + "','" + adminUserID + "', 1, 1);";
      
      connection.query(addOrg, function(err, rows, fields) 
      {
        if (err) 
        {
          console.error(err);
          return;
        }
    
        var lastOrg = "SELECT LAST_INSERT_ID() AS LOR;";
        var LORG;
        connection.query(lastOrg, function(err, rows, fields)
        {
          LORG = rows[0].LOR;
          
          console.log(LORG);
          
          var uniorg = "SELECT * FROM enrolled WHERE User_ID = '" + adminUserID + "';";
    
          connection.query(uniorg, function(err, rows, fields)
          {
            var insorguni = "INSERT INTO University_has_RSO (University_University_Name, RSO_RSO_ID) VALUES ('" + rows[0].University_Name + "','" + LORG + "');";
            connection.query(insorguni,function(err, rows, fields)
            {
    
            });
          });
    
          var member;
          var addmember; 
          var finduser;
          [adminEmail, user2Email, user3Email, user4Email, user5Email].forEach(function(email)
          {
            finduser = "SELECT * FROM user WHERE email = '" + email + "';"
            connection.query(finduser, function(err, rows, fields)
            {
              if (err)
              {
                console.log(err);
              }

              member = rows[0].User_ID;
            
              addmember = "INSERT INTO member_of (RSO_ID, User_ID) VALUES ('" + LORG + "', '" + member + "');";
    
              connection.query(addmember, function(err, rows, fields)
              {
                  
              });
            });
          });
        });
      });
    });
  });
  
  res.redirect("orgs");
});

app.post('/orgs/:orgid', function(req, res, next) 
{
  console.log("******  START ORG ID ******");

  var str = req.url

  var rsoID = str.replace("/orgs/","");

  console.log(rsoID);

  console.log("******  END ORG ID ******");

  var joinOrg = "INSERT INTO member_of (User_ID, RSO_ID) VALUES ('"+ req.session.username + "','" + rsoID + "');";
  var leaveOrg = "DELETE FROM member_of WHERE User_ID= '"+ req.session.username + "' AND RSO_ID= '" + rsoID + "';";
  var joinStatus = 1;

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
          joinStatus = 0;
        }
      }  

      if (joinStatus == 1)
      {            
        console.log("join rso");
      }  
    }
  });

  setTimeout(function()
  {
    if (joinStatus == 1)
    {
      connection.query(joinOrg, function(err, rows, fields) 
      {
        if (err) 
        {
          console.error(err);
          return;
        }
        else
        {
          console.log("id:" + rsoID); 
          console.log("status: " + joinStatus); 

          var queryString = "SELECT * FROM rso WHERE RSO_ID='" + rsoID + "'";
          
          connection.query(queryString, function(err, rows, fields) 
          {
            console.log(rows);
            if (err) 
            {       
              throw err;
            }
              
            else
            {
              res.render('viewRSO', {orgs: rows, joinStatus: joinStatus});
            }          
          });
        }
      });
    }
    else
    {
      connection.query(leaveOrg, function(err, rows, fields) 
      {
        if (err) 
        {
          console.error(err);
          return;
        }
        else
        {
          console.log("id:" + rsoID); 
          console.log("status: " + joinStatus); 

          var queryString = "SELECT * FROM rso WHERE RSO_ID='" + rsoID + "'";

          connection.query(queryString, function(err, rows, fields) 
          {
            console.log(rows);
            if (err) 
            {       
              throw err;
            }
            else
            {
              res.render('viewRSO', {orgs: rows, joinStatus: joinStatus}); 
            }          
          });
        }
      });
    }
  }, 200);
});

app.post('/universities', function(req, res, next) 
{
  var addUni = "INSERT INTO university (University_Name, Location, Description, Student_Population) VALUES ('" + req.body.name + "','" + req.body.location + "','" + req.body.description + "','" + req.body.population + "');";
  var checkPriv = "SELECT COUNT(*) AS User_ID FROM super_admin WHERE User_ID = '" + req.session.username + "';";
  var queryString = "SELECT * FROM university";

  connection.query(checkPriv, function(err, rows, fields) 
  {
    if (err)
    {
      console.log("error");
    } 

    if (rows[0].User_ID > 0)
    {
      connection.query(addUni, function(err, rows, fields) 
      {
        if (err) 
        {
          console.error(err);
          return;
        }
      });

      console.log(req.body);
      connection.query(queryString, function(err, rows, fields) 
      {
        if (err) 
        {       
          throw err;
        }
        else
        {
          res.render('universities', {message: "", unis: rows});
        }
      });
    }
    else
    {
      console.log("you dont have enough badges to add this.");
      connection.query(queryString, function(err, rows, fields) 
      {
        if (err) 
        {       
          throw err;
        }
        else
        {
          res.render("universities",{message: "* You require Super Admin Privileges to create a new University *", unis: rows});
        }         
      });       
    }
  });
});
app.locals = { site: { error: '' } }
module.exports = app;