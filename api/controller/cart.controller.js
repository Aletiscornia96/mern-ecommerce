import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { errorHandler } from "../Middleware/error.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "products.productId"
    );
    if (!cart) {
      return res.status(200).json({ products: [] }); // carrito vacío
    }
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

export const getCartTotal = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.products.length === 0) {
      return res.status(200).json({ total: 0 });
    }

    let total = 0;

    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    res.status(200).json({ total });
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return next(errorHandler(400, "Producto y cantidad son requeridos"));
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Si no hay carrito, lo creamos con el producto
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      // Buscar si el producto ya está en el carrito
      const existingProduct = cart.products.find(
        (p) => p.productId.toString() === productId
      );

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

export const removeFromCart = async (req, res, next) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return next(errorHandler(404, "Carrito no encontrado"));
    }

    const productExists = cart.products.some(
      (p) => p.productId.toString() === productId
    );

    if (!productExists) {
      return next(errorHandler(404, "Producto no está en el carrito"));
    }

    // Filtrar el producto que se quiere eliminar
    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    next(err);
  }
};

export const updateCartProduct = async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== "number") {
    return next(errorHandler(400, "Se requieren productId y quantity válidos"));
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return next(errorHandler(404, "Carrito no encontrado"));
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return next(errorHandler(404, "El producto no está en el carrito"));
    }

    if (quantity === 0) {
      // 🗑️ Eliminar el producto si la cantidad es 0
      cart.products.splice(productIndex, 1);
    } else {
      // ✏️ Actualizar la cantidad si es > 0
      cart.products[productIndex].quantity = quantity;
    }

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return next(errorHandler(404, "Carrito no encontrado"));
    }

    cart.products = []; // Vaciar el array

    const updatedCart = await cart.save();

    res.status(200).json({
      message: "Carrito vaciado correctamente",
      cart: updatedCart,
    });
  } catch (err) {
    next(err);
  }
};
