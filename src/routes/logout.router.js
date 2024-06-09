import { Router } from 'express';

const router = Router();

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/api/productos');
        }
        res.redirect('/api/login');
    });
});

export default router;
