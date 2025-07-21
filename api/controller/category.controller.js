import { errorHandler } from '../Middleware/error.js';
import Category from '../models/category.model.js';


export const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Validar campo "name"
        if (!name || name.trim().length < 3) {
            return next(
                errorHandler(400, 'El nombre de la categoría es obligatorio y debe tener al menos 3 caracteres')
            );
        }

        // Comprueba duplicado
        const existeCat = await Category.findOne({ name: name.trim() });
        if (existeCat) {
            return next(
                errorHandler(409, 'Ya existe una categoría con ese nombre')
            );
        }

        // Crear la categoría
        const nuevaCategoria = await Category.create({
            name: name.trim(),
            description: description?.trim() || '',
        });

        res.status(201).json({
            message: 'Categoría creada exitosamente',
            category: nuevaCategoria,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json({ categories });
    } catch (err) {
        next(err);
    }
};

export const getCategoryBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug });
        if (!category) {
            return next(errorHandler(404, 'Categoría no encontrada'));
        }
        res.status(200).json({ category });
    } catch (err) {
        next(err);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { name, description } = req.body;

        const category = await Category.findOne({ slug });
        if (!category) {
            return next(errorHandler(404, 'Categoría no encontrada'));
        }

        if (name && name.trim().length < 3) {
            return next(
                errorHandler(400, 'El nombre de la categoría debe tener al menos 3 caracteres')
            );
        }

        // Verificar duplicado por nuevo name
        if (name) {
            const newSlug = slugify(name, { lower: true, strict: true });
            const duplicate = await Category.findOne({
                slug: newSlug,
                _id: { $ne: category._id }
            });
            if (duplicate) {
                return next(errorHandler(409, 'Ya existe una categoría con ese nombre'));
            }
            category.name = name.trim();
            category.slug = newSlug;
        }

        if (description !== undefined) {
            category.description = description.trim();
        }

        const updated = await category.save();
        res.status(200).json({
            message: 'Categoría actualizada correctamente',
            category: updated
        });
    } catch (err) {
        next(err);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const deleted = await Category.findByIdAndDelete({ slug });
        if (!deleted) {
            return next(errorHandler(404, 'Categoría no encontrada'));
        }

        res.status(200).json({
            message: 'Categoría eliminada correctamente',
        });
    } catch (err) {
        next(err);
    }
};