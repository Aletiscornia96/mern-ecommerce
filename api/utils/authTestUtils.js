import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Crea usuario y retorna la cookie de sesión
export const createAndLoginUser = async ({ isAdmin = false, email, password }) => {
  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await User.create({
    username: email.split('@')[0],
    email,
    password: hashedPassword,
    isAdmin,
  });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return `access_token=${token}`; // formato que espera cookie-parser
};