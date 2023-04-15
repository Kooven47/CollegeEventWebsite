// Libraries
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// Body Parser
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('index', {message: "", username: undefined, password: undefined});
});

module.exports = router;