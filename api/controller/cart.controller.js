import Cart from '../models/cart.model.js';
import { errorHandler } from '../utils/error.js';

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
    if (!cart) {
      return res.status(200).json({ products: [] }); // carrito vacío
    }
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};
