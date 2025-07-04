import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // excluye la pass
    if (!user) return next(errorHandler(404, 'Usuario no encontrado'));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { password, ...rest } = req.body;

  // Si se quiere actualizar la contraseña, la encriptamos
  if (password) {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    rest.password = hashedPassword;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: rest },
      { new: true }
    ).select('-password'); // Excluimos la contraseña de la respuesta

    if (!updatedUser) return next(errorHandler(404, 'Usuario no encontrado'));

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return next(errorHandler(404, 'Usuario no encontrado'));

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};
