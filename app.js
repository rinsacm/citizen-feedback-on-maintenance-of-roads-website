var createError = require('http-errors');
var express = require('express');
let expressHBS=require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let dbconnect=require('./dbconfig/db-connect');
let session=require('express-session')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let MongoClient=require('mongodb').MongoClient;
const url='mongodb://localhost:27017/test';
var MongoStore = require('connect-mongo')(session);

const client=new MongoClient(url,{useNewUrlParser:true});
client.connect();

var app = express();

// view engine setup
app.engine('.hbs',expressHBS({defaultLayout:'layout',extname:'.hbs'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({store: new MongoStore({client: client}),secret:"mysecret",resave:false,saveUninitialized:false,cookie:{maxAge:180*60*1000}}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req,res,next) {
  
  res.locals.session=req.session;
  next();
})


app.use('/', indexRouter);
app.use('/user', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

dbconnect.connect(function (error) {
  if(error){
    console.log("Unable to connect database");
    process.exit(1);
  }
  else{
    console.log('ComplaintRoad Database connected successfully.......')
  }
});


module.exports = app;
