const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a recipe title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cuisine: {
    type: String,
    enum: ['Italian', 'Asian', 'Mexican', 'Indian', 'Mediterranean', 'American', 'French', 'Other'],
    required: true
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Appetizer', 'Beverage'],
    required: true
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  cookingTime: {
    type: Number,
    required: true,
    min: 0
  },
  prepTime: {
    type: Number,
    required: true,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  ingredients: [{
    name: String,
    quantity: Number,
    unit: String
  }],
  instructions: [{
    step: Number,
    description: String
  }],
  tags: [String],
  image: {
    type: String,
    default: null
  },
  ratings: [{
    userId: mongoose.Schema.Types.ObjectId,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
