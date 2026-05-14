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
    variants: {
      type: [
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
      default: []
    },
    highlights: {
      type: [
        {
          title: String,
          description: String,
          image: String
        }
      ],
      default: []
    },
    specifications: {
      type: Map,
      of: String,
      default: {}
    },
    reviews: [
      {
        user: { type: String, required: true },
        userName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    averageRating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
