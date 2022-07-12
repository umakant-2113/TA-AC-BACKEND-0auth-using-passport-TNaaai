var express = require('express');
const passport = require('passport');
const { Passport } = require('passport');
const app = require('../app');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// success router
router.get("/success",(req,res,next)=>{
  res.render("success")
})

router.get("/failure",(req,res,next)=>{
  res.render("/failure")
})

router.get('/auth/github', passport.authenticate('github'))

//github server comes back to our application
router.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/failure'
}), (req, res) => {
  res.redirect('/success')
})




app.get("/auth/google",passport.authanticate("google"))

app.get("/auth/google/callback",passport.authenticate("google",{failureRedirect:"/logon"}),
function(req,res){
  res.redirect("/success")
}
)


module.exports = router;
