var express = require('express');
var router = express.Router();
let bcrypt=require('bcrypt-nodejs');

let passport=require('passport');
const { check, validationResult } = require('express-validator');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/login',function(req,res,next){
  let messages=req.flash('error');
  res.render('user/login',{messages:messages,hasError:messages.length>0})
})
router.get('/signup',function(req,res,next){
  let messages=req.flash('error')
  res.render('user/signup',{messages:messages,hasError:messages.length>0})
})
router.post('/login',[check('email','Invalid email').isEmail(),check('password','Invalid password.').isLength({min:5})],
passport.authenticate('local-signin',
    {
        successRedirect:'/user/profile',
        failureRedirect:'/user/login',
        failureFlash:true
    }
)
)
router.post('/signup',[check('email','Invalid email').isEmail(),check('password','Invalid password.').isLength({min:5})],
passport.authenticate('local-signup',
    {
        
        failureRedirect:'/user/signup',
        failureFlash:true
    }),function(req,res,next){
        if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
        } 
        else {
            res.redirect('/user/profile')
        }
    })
    router.get('/logout',isLoggedIn,function (req,res,next) {
      req.logOut();
      res.redirect('/')
  })
router.get('/profile',function (req,res,next){
  
  res.render('user/profile')
})
function isLoggedIn(req,res,next){
  if(req.isAuthenticated())
      return next();

  res.redirect('/')   
}
function notLoggedIn(req,res,next){
  if(!req.isAuthenticated())
      return next();

  res.redirect('/')
}
module.exports = router;
