let passport=require("passport");
let User=require("../models/User")
var GitHubStrategy = require('passport-github').Strategy;


passport.use(new GitHubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret:process.env.CLEINT_SECRET,
  callbackURL: "/auth/github/callback"  

} ,   (accessToken,refreshToken,profile,done)=>{
// console.log(profile)

let user_profile={
    name:profile.displayName,
    username:profile.username,
    email:profile._json.email,
    images:profile._json.avatar_url
}

User.findOne({ email: profile._json.email },(err,user)=>{
    if(err) return done(err);
    if(!user){
        User.create(user_profile,(err,addUser)=>{
            if(err) return done(err);
            return done(null,addUser)
        })
    }
    done(null,user)
})

}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})