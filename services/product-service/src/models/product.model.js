const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please add a price']
    },
    category: {
      type: String,
      required: [true, 'Please add a category']
    },
    stock: {
      type: Number,
      default: 0
    },
    images: {
      type: [String],
      default: []
    },
    variants: [
      {
        colorName: String,
        colorCode: String,
        images: [String],
        stock: {
          type: Number,
          default: 0
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Search index
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
