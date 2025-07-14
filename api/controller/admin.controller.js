import User from '../models/user.model.js';
import { errorHandler } from '../Middleware/error.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password'); // excluye el password
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const promoteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true }
    ).select('-password');

    if (!user) return next(errorHandler(404, 'Usuario no encontrado'));

    res.status(200).json({
      message: 'Usuario promovido a administrador',
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const demoteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: false },
      { new: true }
    ).select('-password');

    if (!user) return next(errorHandler(404, 'Usuario no encontrado'));

    res.status(200).json({
      message: 'Permisos de administrador revocados',
      user,
    });
  } catch (err) {
    next(err);
  }
};
