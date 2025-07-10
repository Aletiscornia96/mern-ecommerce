import mongoose from "mongoose";
 const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },

    products: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },

        quantity: { 
            type: Number, 
            required: true,
            min: 1 
        },

    }],

    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },

    status:{
        type: String,
        enum: ['pendiente', 'enviado', 'completado', 'cancelado'],
        default: 'pendiente',
    },

    shippingAddress: {
        type: String,
    }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;