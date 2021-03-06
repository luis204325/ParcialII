const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
}); 

passport.deserializeUser(async(id, done) => {
  const user = await User.findById(id);
  done(null, user);
}); 



passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req ,email, password, done) => {

   const user = await User.findOne({email:email});
   if(user){
       return done(null, false, req.flash('signupMessage','The Email is alredy taken.'));
   }
   else {
    const Newuser =   new User();
    Newuser.email = email;
    Newuser.password = Newuser.encryptPassword(password);
    await Newuser.save();
    done(null, Newuser);
   }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    const user = await User.findOne({email: email});
    if(!user) {
      return done(null, false, req.flash('signinMessage', 'No User Found'));
    }
    if(!user.comparePassword(password)) {
      return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
    }
    return done(null, user);
  }));