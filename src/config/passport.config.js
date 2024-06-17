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

// Estrategia de GitHub
passport.use(new GitHubStrategy({
  clientID: 'GITHUB_CLIENT_ID',
  clientSecret: 'GITHUB_CLIENT_SECRET',
  callbackURL: 'http://localhost:8080/api/login/github/callback'
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
