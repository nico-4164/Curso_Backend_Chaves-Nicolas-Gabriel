import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', (req, res) => {
    const { username, password } = req.body;

    //Verificación de credenciales
    if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = {
            username,
            role: 'admin'
        };
        res.redirect('/api/productos');
    } else {
        req.session.user = {
            username,
            role: 'usuario'
        };
        res.redirect('/api/productos');
    }
});

export default router;
