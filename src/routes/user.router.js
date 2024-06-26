import { Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { userModel } from '../models/user.model.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/api/productos',
  failureRedirect: '/api/login'
}));

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: email === 'adminCoder@coder.com' ? 'admin' : 'usuario'
    });
    res.redirect('/api/login');
  } catch (error) {
    res.send({ status: 'error', error });
  }
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api/login'
}), (req, res) => {
  res.redirect('/api/productos');
});

router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/api/login');
});

export default router;
