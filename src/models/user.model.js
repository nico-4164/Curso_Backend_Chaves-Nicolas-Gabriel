import mongoose from 'mongoose';

const userCollection = 'usuarios';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario',
  },
  githubId: String, // Campo para OAuth de GitHub
});

export const userModel = mongoose.model(userCollection, userSchema);
