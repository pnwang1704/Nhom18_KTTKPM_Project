const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    image: {
      type: String
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
        options: [
          {
            storage: String,
            price: Number,
            stock: {
              type: Number,
              default: 0
            }
          }
        ]
      }
    ],
    highlights: [
      {
        title: String,
        description: String,
        image: String
      }
    ],
    specifications: {
      type: Map,
      of: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
