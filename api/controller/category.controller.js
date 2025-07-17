import Category from '../models/category.model.js';

export const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name || name.trim().length < 3) {
            return res.status(400).json({
                errors: [{ message: 'El nombre de la categoría es obligatorio y debe tener al menos 3 caracteres' }]
            });
        }

        // Chequeo de duplicado
        const existe = await Category.findOne({ name: name.trim() });
        if (existe) {
            return res.status(409).json({
                errors: [{ message: 'Ya existe una categoría con ese nombre' }]
            });
        }

        const nuevaCategoria = await Category.create({
            name: name.trim(),
            description: description?.trim() || ''
        });

        res.status(201).json({
            message: 'Categoría creada exitosamente',
            category: nuevaCategoria
        });
    } catch (error) {
        next(error);
    }
};