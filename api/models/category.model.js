import mongoose from 'mongoose';
import slugify from 'slugify';


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true
});

categorySchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;