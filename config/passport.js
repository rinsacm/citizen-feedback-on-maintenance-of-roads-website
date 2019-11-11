var express = require('express');
var router = express.Router();
let passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
let bcrypt=require('bcrypt-nodejs');
let dbconnect=require('../dbconfig/db-connect')
let flash=require('connect-flash')
let {check,validationResult}=require('express-validator')
let ObjectID = require('mongodb').ObjectID;


passport.serializeUser(function(user, done) {
    console.log(user)
    console.log("serialized")
    console.log(user._id)

    done(null,user._id);
});
passport.deserializeUser(function(id, done) {
    let idString=id
    let objId = new ObjectID(idString);
    dbconnect.get().collection('admin').findOne({_id:objId}, function(err, user) {
        console.log("KK"+user._id)
        done(null, user);
    });
});

passport.use('local-signup',new LocalStrategy({usernameField:'email',passwordField:'password',passReqToCallback:true},
    function(req,email, password, done) {



        let errors=validationResult(req).array()

        if(errors.length>0)
        {
            console.log('errrr')
            let messages=[]
            errors.forEach(function(error){
                messages.push(error.msg)
            })
            return done(null,false,req.flash('error',messages))
        }

            dbconnect.get().collection('users').findOne({email:email}, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    console.log('yes user')
                    return done(null, false, {message: 'Email is already in use.'});
                }
                let encryptedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
                let newUser = {name:name,email: email, password: encryptedPassword}


                dbconnect.get().collection('admin').insertOne(newUser);
                console.log(newUser)
console.log("HH"+newUser._id)

                return done(null, newUser);

            });

    }
));

passport.use('local-signin',new LocalStrategy({usernameField:'email',passwordField:'password',passReqToCallback:true},
    function(req,email, password, done) {



        let errors=validationResult(req).array()

        if(errors.length>0)
        {
            console.log('errrr')
            let messages=[]
            errors.forEach(function(error){
                messages.push(error.msg)
            })
            return done(null,false,req.flash('error',messages))
        }

        dbconnect.get().collection('admin').findOne({email:email}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                console.log('not user')
                return done(null, false, {message: 'User not found.'});
            }
            if(user){

                        if(!bcrypt.compareSync(password,user.password))
                            return done(null, false, {message: 'Wrong Password'});
                    console.log("us"+user.email)




            }
            console.log("usss"+user.email)
            return done(null,user)



        });

    }
));




module.exports = router;
