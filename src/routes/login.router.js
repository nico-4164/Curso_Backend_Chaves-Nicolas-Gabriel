import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/productos',
    failureRedirect: '/api/login',
    failureFlash: true
}));

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api/login'
}), (req, res) => {
    res.redirect('/api/productos');
});

export default router;
