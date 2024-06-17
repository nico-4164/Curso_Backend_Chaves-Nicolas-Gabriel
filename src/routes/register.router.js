import { Router } from 'express';
import bcrypt from 'bcrypt';
import { userModel } from '../models/user.model.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', async (req, res) => {
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

export default router;
