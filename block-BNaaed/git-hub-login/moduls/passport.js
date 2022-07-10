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
console.log(profile._json.avatar_url)
// console.log(user_profile)
User.findOne({ email: profile._json.email },(err,user)=>{
    console.log(user,'userdata')
    if(err) return done(err);

    if(!user){
        User.create(user_profile,(err,addUser)=>{
            console.log(addUser,"adduser data")
            if(err) return done(err);
            return done(null,addUser)
        })
    }
    done(null,false)
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