var express = require('express');
var router = express.Router();
const db = require('../config/database');
const { successPrint,errorPrint } = require('../helpers/debug/debugprinters');
const bcrypt = require('bcrypt');
const UserModel = require('../models/Users');
const UserError = require('../helpers/error/UserError');


// router.get('/getAllUsers', (req,res,next) => {
//    //db.query("INSERT INTO users (`username`,`email`,`password`,`created`) VALUES ('ME1','alexSh1irazi@dream.com','Karol i miss you',now());")
   
//     db.query("SELECT * FROM users;", (err,results,fields)=>{
//        console.log(results);
//        res.send(results);   
//    });

// });




router.post('/createUser', (req, res, next) => {
  console.log(req.body);
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.cpassword;

//vaildation logic
  let letters=/^[a-zA-Z]+$/;
  let validEmail =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)?$/;
  let passwordRequirements = /^(?=.*\d)(?=.*[!@#+$%/^&-*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  
  let errorCount=0;
  

  
  if(username.length<3||username.length>20||username.charAt(0).match(letters)==false||username===''||username==null){
      throw new UserError(
          "Username rejected","/registration",200);
  };
  if(email.length<4||email.length>254||email.match(validEmail)==false||email===''||email==null){
      throw new UserError(
          "email rejected","/registration",200);
  };
  if(password.length<3||password.length>20|| passwordRequirements.test(password)==false||password===''||password==null){
      throw new UserError(
          "password rejected","/registration",200);
  };
  if(password != cpassword){
      throw new UserError(
          "password must match confirm password", "/registration",200);
      
  };
  if(errorCount > 0){
      throw new UserError("f","/registration",200);
  };

  UserModel.usernameExists(username)
  .then((userDoesExist)=>{
    if(userDoesExist){
      throw new UserError("Registration Failed: Username already exists","/registration",200);
    }else{
      return UserModel.emailExists(email);
    }
  }).then((emailDoesExist)=>{
    if(emailDoesExist){
      throw new UserError("Registration Failed: Email already exists","/registration",200);
    }else{
      return UserModel.create(username,email,password);
    }
  })
  .then((createdUserId)=>{
    if(createdUserId<0){
      throw new UserError("Server error, user could not be created RIP :(","/registration",500);
    }else{
      console.log("user was successfully created");
           req.flash('success','user has been created!');
           res.redirect('/login');
    }
  })
  .catch((error)=>{
      console.log("User could not be made "+error);
      if(error instanceof UserError){
          console.log(error.getMessage());
         console.log(error.getStatus());
         req.flash('error','user has not been created!');
          res.redirect(error.getredirectUrl());
      }else {
          next(error)
      }
    });
});
    


router.post('/login',async (req, res, next) => {

let username = req.body.username;
let password = req.body.password;

let letters=/^[a-zA-Z]+$/;
let passwordRequirements = /^(?=.*\d)(?=.*[!@#+$%/^&-*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;


if(username.length<3||username.length>20||username.charAt(0).match(letters)==false||username===''||username==null){
  throw new UserError(
      "Username rejected","/registration",200
     
  );
 
};
if(password.length<3||password.length>20|| passwordRequirements.test(password)==false||password===''||password==null){
  throw new UserError(
      "password rejected","/registration",200
  );
};

 await UserModel.authenticate(username,password)
  .then((loggedUserId)=>{
  if(loggedUserId>0){

   
    successPrint(`User ${username} is logged in`);
    req.session.username = username;
    req.session.userId = loggedUserId;
    res.locals.logged=true;
    res.cookie("logged",username,{expires:new Date(Date.now()+900000), httpOnly: false});
   req.flash('success','You have been logged in!');
   req.session.save(()=>{
    res.redirect("/");
   })

  }else{
    throw new UserError("Invalid username and/or password!","/login",200);
  }
})
.catch((error)=>{
  errorPrint("user Login failed");
  if(error instanceof UserError){
    errorPrint(error.getMessage());
    res.status(error.getStatus());
    req.flash('error',error.getMessage());
    res.redirect('/login');
  }else{
    next(error);
  }
})


});


router.get('/logout',(req, res, next) =>{
req.session.destroy((err)=>{
  if(err){
  errorPrint("session could not be destroyed");
  next(err);  
  }else{
    successPrint("session destroyed");
    res.clearCookie("csid");
   // res.json({status: "OK", message: "user is logged out"});
  res.redirect('/');
  }
});
});

module.exports = router;

