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

//Eliminar un producto
export const deleteProduct = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, 'No tienes permisos para eliminar este producto'))
    }
    try {
        await Product.findByIdAndDelete(req.params.productId);
        res.status(200).json('El producto fue eliminado');
    } catch (error) {
        next(error);
    }
};

//Crear un producto
export const create = async (req, res, next) => {
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


