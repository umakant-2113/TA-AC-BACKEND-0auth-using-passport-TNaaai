var express = require('express');
var router = express.Router();
let User=require("../models/User")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// register user 

router.get("/register",(req,res,next)=>{
  res.render("register")
})

// capture data from rigister form

router.post("/register",(req,res,next)=>{

 User.create(req.body,(err,user)=>{
if(err) return next(err);
res.redirect("/users/login")
 }) 
})

// login page

router.get("/login",(req,res,next)=>{
  res.render("login")
})

// compare data from data base

router.post("/login",(req,res,next)=>{
  let {email,password}=req.body;
  if(!email && !password){
    return res.redirect("/users/login")
  }
  if(email){
    User.findOne({email},(err,user)=>{
      if(err) return next(err);
      if(!user){
        return res.redirect("/users/login")
      }
      user.verifyPassword(password,(err,result)=>{
        if(err) return next(err);
        if(!result){
          return res.redirect("/users/login")
        }

        req.session.userId=user.id;
      res.redirect("/articles")
      })
    })
  }
})

// log out page 

router.get('/logout', (req, res, next) => {
  res.clearCookie('connect.sid')
  req.session.destroy()
  res.redirect('/users/login')
})

module.exports = router;
