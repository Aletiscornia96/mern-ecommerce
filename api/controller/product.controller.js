import Product from '../models/product.model.js'
import { errorHandler } from '../utils/error.js'

// Obtener todos los productos
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        next(error)
    }
};

//Obtener un producto
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(errorHandler(404, 'Producto no encontrado'));
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

//Eliminar un producto
export const deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.productId);
        res.status(200).json('El producto fue eliminado');
    } catch (error) {
        next(error);
    }
};

//Crear un producto
export const createProduct = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'No tienes permisos para crear un producto'));
    }
    if(!req.body.name || !req.body.price || !req.body.size || !req.body.color){
        return next(errorHandler(400, 'Ingrese los campos requeridos'))
    }
    const slug = req.body.name.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newProduct = new Product ({
        ...req.body, slug, userId: req.user.id
    });
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    } catch (error) {
        next(error)
    }
};

//Actualizar un producto
export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedProduct){
        return next(errorHandler(404, 'Producto no encontrado'));
    }; 

    res.status(200).json(updatedProduct);
  } catch (err) {
    next(err);
  }
};


