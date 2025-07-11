import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { errorHandler } from '../Middleware/error.js';

export const createOrderFromCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart || cart.products.length === 0) {
            return next(errorHandler(400, 'El carrito está vacío'));
        }

        let totalPrice = 0;
        const orderProducts = [];

        for (const item of cart.products) {
            const product = await Product.findById(item.productId);
            if (!product || product.stock < item.quantity) {
                return next(errorHandler(400, `Stock insuficiente para ${product?.name || 'producto'}`));;
            }

            // Descontar stock
            product.stock -= item.quantity;
            await product.save();

            totalPrice += product.price * item.quantity;
            orderProducts.push({ productId: product._id, quantity: item.quantity });
        }

        const newOrder = new Order({
            userId: req.user.id,
            products: orderProducts,
            totalPrice,
            shippingAddress: req.body.shippingAddress || '',
            status: 'pendiente',
        });

        const savedOrder = await newOrder.save();

        // Vaciar el carrito
        await Cart.findOneAndUpdate({ userId: req.user.id }, { products: [] });

        res.status(201).json(savedOrder);
    } catch (error) {
        next(error);
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('products.productId');
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('userId', 'username email').populate('products.productId');
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('products.productId')
            .populate('userId', 'username email');

        if (!order) {
            return next(errorHandler(404, 'Orden no encontrada'));
        }

        if (order.userId._id.toString() !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'No tienes permiso para ver esta orden'));
        }

        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['pendiente', 'procesando', 'completada', 'cancelada'];

    if (!validStatuses.includes(status)) {
        return next(errorHandler(400, 'Estado no válido'));
    }

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId', 'username email');

        if (!order) {
            return next(errorHandler(404, 'Orden no encontrada'));
        }

        res.status(200).json({
            message: 'Estado actualizado correctamente',
            order,
        });
    } catch (error) {
        next(error);
    }
};

export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(errorHandler(404, 'Orden no encontrada'));
        }

        if (order.userId.toString() !== req.user.id) {
            return next(errorHandler(403, 'No tienes permiso para cancelar esta orden'));
        }

        if (order.status !== 'pendiente') {
            return next(errorHandler(400, 'Solo se pueden cancelar órdenes pendientes'));
        }

        order.status = 'cancelada';
        await order.save();

        res.status(200).json({ message: 'Orden cancelada correctamente', order });
    } catch (error) {
        next(error);
    }
};
