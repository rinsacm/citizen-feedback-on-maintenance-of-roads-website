var express = require('express');
var router = express.Router();
const multer = require('multer');
var mult=require('../multer/multer');
let db=require('../dbconfig/db-connect');
let fs=require('fs');
let ObjectID = require('mongodb').ObjectID;
let assert = require('assert');
let nodemail=require('../nodemailer/mailer')
/* GET home page. */
router.get('/', isAdminCreated,function(req, res, next) {
  
  
  console.log(req.session.token)
  res.render('index', { title: 'Citizen feedback portal' ,layout:'layout'});
});
router.get('/register', function(req, res, next) {
  res.render('complaint/register',{title:'Register Complaint'});
});

router.post('/register',mult.upload.single('image'), (req, res, next) => {
  console.log("hi")
  const files = req.file
  console.log(req.file);
  
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
  }
  
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString('base64');
  // Define a JSONobject for the image attributes for saving to database
   
  var finalImg = {
       contentType: req.file.mimetype,
       image:  new Buffer(encode_image, 'base64')
  };
  let token;
  let name=req.body.name;
  let email=req.body.email;
  let category=req.body.category;
  let district =req.body.district;
  let localBody=req.body.localbody;
  let location=req.body.location;
  let description=req.body.description;
  
  
  req.session.token=req.session.token+1;
  token=req.session.token;
  db.get().collection('complaints').insertOne({
    "token":token,
    "name":name,
    "email":email,
    "category":category,
    "district":district,
    "localbody":localBody,
    "location":location,
    "description":description,
    "image":finalImg,
    "status":"not checked"
}, (err, result) => {
  let mailOptions= {
    from: 'cffmrfeedback@gmail.com',
    to: req.body.email,
    subject: 'Complaint registered',
    text: 'Your complaint on road is registered.Your token no. is '+token
};   
  
  
  console.log(req.session.token)
  
     if (err) return console.log(err)

     console.log('saved to database')

     nodemail.transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error.message);
    }
    console.log('success');
});
    res.render('complaint/register-success',{tokenno:req.session.token})
      
  })
  
    
    
  
})

router.get('/photo/:token', function(req, res,next) {
  console.log("H")
  
  let tno=parseInt(req.params.token)
   
  db.get().collection('complaints').findOne({'token': tno}, (err, result) => {
    console.log(result)
      if (err) return console.log(err)
    console.log(result.image);
    result=result.image;
     res.contentType('image/jpeg');
     res.send(result.image.buffer)
     
      
    })
  })
router.get('/complaint-status',function(req,res,next){
  let messages=req.flash('error')
  res.render('complaint/complaintStatus',{title:'Complaint status'})
  })
router.post('/complaint-status',function(req,res,next){
  let tokenNo=parseInt(req.body.tokenno);
  console.log(tokenNo+7)
  db.get().collection('complaints').findOne({"token":tokenNo},(err,complaint)=>{
    console.log(complaint)
    if(complaint)
    res.render('complaint/complaintView',{title:'Complaint Status',complaint:complaint,layout:'layout'})
    else
    {
      let messages="Invalid token";
    res.redirect('/complaint-status')
    }
  })
  
})
router.get('/contact-us',function(req,res,next){
  res.render('contactUs',{title:'Contact Us'});
})
router.get('/feedback-us',function(req,res,next){
  var successMsgs = req.flash('success')[0];
  res.render('feedback',{title:'General feedback',successMsgs: successMsgs, noMessage: !successMsgs})
})
router.post('/feedback-us',function(req,res,next){
  console.log("hi")
  
  db.get().collection('feedbacks').insertOne({name:req.body.name,email:req.body.email,subject:req.body.subject,message:req.body.message},(err,result)=>{
    console.log("feedback send");
    req.flash('success', 'Feedback sent!');
    res.redirect('/feedback-us')
  })
})
function isAdminCreated(req,res,next){
  db.get().collection('admin').count((err,result)=>{
    console.log("g")
    console.log(result)
    if(err)
      console.log(err)
    else if(result==0)
    {

      res.redirect('/admin/signup');
    }
    else
      return next();
  });
}

module.exports = router;
