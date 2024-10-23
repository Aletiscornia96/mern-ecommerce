import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,

    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        require: true,
    },

    address: {
        type: String,
    },

    phone: {
        type: Number,
    },

    isAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true } );

const User = mongoose.model('User', userSchema);

export default User;
