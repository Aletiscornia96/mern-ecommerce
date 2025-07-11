import User from '../models/user.model.js';
import { errorHandler } from '../Middleware/error.js';
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
  try {
    // Campos permitidos para actualizar
    const allowedFields = ['username', 'email', 'password', 'avatar', 'phone', 'address'];
    const updates = {};

    // Filtramos los campos recibidos
    for (const field of allowedFields) {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    }

    // Encriptamos la contraseña si se incluye
    if (updates.password) {
      updates.password = await bcryptjs.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return next(errorHandler(404, 'Usuario no encontrado'));
    }

    res.status(200).json({
      success: true,
      user: updatedUser
    });

  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return next(errorHandler(404, 'Usuario no encontrado'));

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente',
    });
  } catch (err) {
    next(err);
  }
};
