import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    price: {
        type: Number,
        required: true,
    },

    size: {
        type: String,
        require: true,
    },

    color:{
        type: String,
        required: true
    },

    productPicture: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=740'
    }

}, { timestamps: true } );

const Product = mongoose.model('Product', productSchema)

export default Product;