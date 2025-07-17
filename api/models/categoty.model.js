import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
export default Category;