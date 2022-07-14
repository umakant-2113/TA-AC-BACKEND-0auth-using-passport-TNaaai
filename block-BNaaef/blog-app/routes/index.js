var express = require('express');
let passport=require("passport")
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// git hub router

router.get("/auth/github",passport.authenticate("github"));
router.get("/auth/github/callback",passport.authenticate("github" ,{failureRedirect: "/users/login",session:false}),(req,res)=>{
res.redirect("/articles")
})

// google router

router.get('/auth/google',
  passport.authenticate('google', { scope:
  	[ 'email', 'profile' ] }
));
 
router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/articles',
        failureRedirect: '/users/login'
}));


module.exports = router;
