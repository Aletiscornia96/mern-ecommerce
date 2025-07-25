import Product from '../models/product.model.js'
import { errorHandler } from '../Middleware/error.js'

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
export const getOneProduct = async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return next(errorHandler(404, 'Producto no encontrado'));
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

//Eliminar un producto
export const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};


//Crear un producto
export const createProduct = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'No tienes permisos para crear un producto'));
    }
    if (!req.body.name || !req.body.price || !req.body.size || !req.body.color) {
        return next(errorHandler(400, 'Ingrese los campos requeridos'))
    }
    const slug = req.body.name.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newProduct = new Product({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const saveProduct = await newProduct.save();
        return res.status(201).json({
            message: 'Producto creado exitosamente',
            product: saveProduct,
        });

    } catch (error) {
        next(error)
    }
};

//Actualizar un producto
export const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({
            message: 'Producto actualizado exitosamente',
            product: updatedProduct,
        });
    } catch (error) {
        next(error);
    }
};