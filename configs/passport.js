const passport = require('passport'),
  passportLocal = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose'),
  User = require('../models/user.model'),
  LocalStrategy = require('passport-local').Strategy;

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'TOP_SECRET';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  (email, password, cb) => {
    //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT  

    return User.findOne({ email, password })
      .then(user => {
        console.log("inthen")
        if (!user) {
          return cb(null, false, { message: 'Incorrect email or password.' })
        }
        return cb(null, user, { message: 'Logged In Successfully' })
      })
      .catch(err => cb(err))
  }
));

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      console.log("name ")
      try {
        User.findOne({ email }).then(async user => {
          if (!user) {
            console.log("suc from pass")
            return done(null, undefined, { success: true });
          }
          else {
            console.log("Already from pass")
            return done(null, undefined, { success: false })
          }
        }
        )

      } catch (error) {
        done(error);
      }
    }
  )
);
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);
        console.log(validate)
        if (!validate) {
          console.log("wraong pass")
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        console.log('err '+error)
        return done(error,{message:"error"});
      }
    }
  )
);
passport.use(
  'pass',
  new JWTstrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload._id).then(user => {
      if (user) return done(null, user);
      return done(null, false);
    }).catch(err => console.log(err));
  })
);
passport.use(
  'logout',
  new JWTstrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload._id).then(user => {0
      if (user){
        return done(null, user);
      }
      return done(null, false);
    }).catch(err => console.log(err));
  })
);