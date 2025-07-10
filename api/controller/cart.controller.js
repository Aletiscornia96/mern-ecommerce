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

export const addToCart = async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return next(errorHandler(400, 'Producto y cantidad son requeridos'));
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Si no hay carrito, lo creamos con el producto
      cart = new Cart({
        userId,
        products: [{ productId, quantity }]
      });
    } else {
      // Buscar si el producto ya está en el carrito
      const existingProduct = cart.products.find(p => p.productId.toString() === productId);

      if (existingProduct) {
        // Si ya está, sumamos la cantidad
        existingProduct.quantity += quantity;
      } else {
        // Si no está, lo agregamos
        cart.products.push({ productId, quantity });
      }
    }

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    next(err);
  }
};
