import accountModel from '../models/account.model';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { RoleName } from '../models/account.model';
import passport from 'passport';
import jwt from 'jsonwebtoken';

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
        callbackURL: process.env.addressFE ||`http://localhost:4200/google/callback/`,
      }, (accessToken, refreshToken, profile, done) => {
        // Check if google profile exist.
        if (profile.id) {
          accountModel.findOne({googleId: profile.id})
          accountModel.findOne({email : profile.emails[0].value})
            .then((existingUser) => {
              if (existingUser) {
                done(null, existingUser);

              } else {
                const userAccount = new accountModel({
                  googleId: profile.id,
                  email: profile.emails[0].value,
                  fullname: profile.name.givenName,
                  password : "default",
                  role : RoleName.GUEST
                })
                  .save()
                  .then(user => done(null, user));
              }
            })
        }
      })
  );
  
  export  function googleAuth (req,res,next) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    };

    export function googleAuthCallback (req, res, next)  {
        passport.authenticate('google', { failureRedirect: '/login' }, (err, userAccount) => {
       const token = jwt.sign(
         { userAccount }, 
         process.env.JWT_SECRET, 
         { expiresIn: '1h' } 
       );
     return res.json({
         accessToken: token,
         userData: userAccount
       });
     })(req, res, next)
   };
   