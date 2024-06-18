import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import bcrypt from 'bcrypt';
import { userModel } from '../models/user.model.js';

// Estrategia Local
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: 'Email incorrecto.' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Contraseña incorrecta.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use(new GoogleStrategy({
    clientID: '31642225161-cq67nnqdkegl86ph40ppjtmj3ubgfab3.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:8080/api/sesion/login"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userModel.findOne({ googleId: profile.id });
      if (!user) {
        user = await userModel.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          role: 'usuario'
        });
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));


// Estrategia de GitHub - Falta terminar
passport.use(new GitHubStrategy({
  clientID: '',
  clientSecret: '',
  callbackURL: 'http://localhost:8080/api/login/github'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await userModel.findOne({ githubId: profile.id });
    if (!user) {
      user = await userModel.create({ 
        githubId: profile.id, 
        email: profile.emails[0].value, 
        first_name: profile.displayName || profile.username,
        role: 'usuario'
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
