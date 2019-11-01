var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/login',function (req,res,next){
  
  res.render('user/login')
})
router.get('/signup',function (req,res,next){
  
  res.render('user/signup')
})
router.get('/profile',function (req,res,next){
  
  res.render('user/profile')
})
module.exports = router;
