var express = require('express');
let expressHBS=require('express-handlebars');
var app=express();
var router = express.Router();
let bcrypt=require('bcrypt-nodejs');
let dbconnect=require('../dbconfig/db-connect')
let passport=require('passport');
const { check, validationResult } = require('express-validator');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/dashboard',isLoggedIn,function(req,res,next){
  dbconnect.get().collection('complaints').count(function(err,result){
    
    req.session.totalComplaints=result;
    
      res.render('admin/dashboard',{totalcomplaints:req.session.totalComplaints})
      
   
  })
    
    
    
})
router.get('/login',function(req,res,next){
  let messages=req.flash('error');
 
  res.render('admin/login',{messages:messages,hasError:messages.length>0})
})
router.get('/signup',function(req,res,next){
  let messages=req.flash('error')
  res.render('admin/signup',{messages:messages,hasError:messages.length>0})
})
router.post('/login',[check('email','Invalid email').isEmail(),check('password','Invalid password.').isLength({min:5})],
passport.authenticate('local-signin',
    {
        successRedirect:'/admin/dashboard',
        failureRedirect:'/admin/login',
        failureFlash:true
    }
)
)
router.post('/signup',[check('email','Invalid email').isEmail(),check('password','Invalid password.').isLength({min:5})],
passport.authenticate('local-signup',
    {
        
        failureRedirect:'/admin/signup',
        failureFlash:true
    }),function(req,res,next){
        if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
        } 
        else {
            res.redirect('/admin/dashboard')
        }
    })
    router.get('/logout',isLoggedIn,function (req,res,next) {
      req.logOut();
      res.redirect('/')
  })

router.get('/complaint-view-admin',isLoggedIn,function(req,res,next){
  dbconnect.get().collection('complaints').find().toArray(function(err,docs){
    res.render('complaint/complaint-view-admin', {complaints:docs});
  })
  
})
router.post('/complaint-view-admin',isLoggedIn,function(req,res,next){
  let no=parseInt(req.body.search);
  if(no)
  
  dbconnect.get().collection('complaints').find({token:no}).toArray(function(err,docs){
    res.render('complaint/complaint-view-admin', {complaints:docs});
  })
  else
  dbconnect.get().collection('complaints').find().toArray(function(err,docs){
    res.render('complaint/complaint-view-admin', {complaints:docs});
  })
  
})
router.post('/upload-progress/:token',isLoggedIn,function(req,res,next){
  let status=req.body.progress;
  let token=parseInt(req.params.token);
  console.log(token)
  dbconnect.get().collection('complaints').updateOne({"token":token},{$set:{"status":status}});
  res.redirect('/admin/complaint-view-admin')
})
function isLoggedIn(req,res,next){
  if(req.isAuthenticated())
      return next();

  res.redirect('/admin/login')   
}
function notLoggedIn(req,res,next){
  if(!req.isAuthenticated())
      return next();

  res.redirect('/admin/login')
}
module.exports = router;
