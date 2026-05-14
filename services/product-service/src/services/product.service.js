const Product = require('../models/product.model');

class ProductService {
  async getAllProducts(query) {
    const { search, category, minPrice, maxPrice, page = 1, limit = 10, sort } = query;

    const filter = {};

    // Search by name or description (Partial & Case-insensitive)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execution
    const products = await Product.find(filter)
      .sort(sort || '-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    return {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async createProduct(productData) {
    return await Product.create(productData);
  }

  async updateProduct(id, updateData) {
    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async createProductReview(productId, reviewData) {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    product.reviews.push(reviewData);
    product.numReviews = product.reviews.length;
    
    // Calculate average rating
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();
    return product;
  }

  async getAllReviews() {
    const products = await Product.aggregate([
      { $unwind: "$reviews" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$name",
          reviewId: "$reviews._id",
          user: "$reviews.user",
          userName: "$reviews.userName",
          rating: "$reviews.rating",
          comment: "$reviews.comment",
          createdAt: "$reviews.createdAt"
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    return products;
  }

  async deleteReview(productId, reviewId) {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    product.reviews = product.reviews.filter(r => r._id.toString() !== reviewId);
    product.numReviews = product.reviews.length;

    if (product.numReviews > 0) {
      const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
      product.averageRating = totalRating / product.reviews.length;
    } else {
      product.averageRating = 0;
    }

    await product.save();
    return product;
  }
}

module.exports = new ProductService();
