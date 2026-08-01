const express = require('express');
const Recipe = require('../models/Recipe');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all recipes with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, cuisine, category, difficulty } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (cuisine) filter.cuisine = cuisine;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const recipes = await Recipe.find(filter)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: recipes.length, recipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('ratings.userId', 'username avatar');

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create recipe (authenticated)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, cuisine, category, servings, cookingTime, prepTime, difficulty, ingredients, instructions, tags, image } = req.body;

    const recipe = await Recipe.create({
      title,
      description,
      author: req.userId,
      cuisine,
      category,
      servings,
      cookingTime,
      prepTime,
      difficulty,
      ingredients,
      instructions,
      tags,
      image
    });

    const populatedRecipe = await recipe.populate('author', 'username avatar');

    res.status(201).json({ success: true, recipe: populatedRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update recipe (authenticated, author only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this recipe' });
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete recipe (authenticated, author only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add rating to recipe
router.post('/:id/rating', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Remove existing rating from user
    recipe.ratings = recipe.ratings.filter(r => r.userId.toString() !== req.userId);

    // Add new rating
    recipe.ratings.push({ userId: req.userId, rating, comment });

    // Calculate average rating
    recipe.averageRating = recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length;

    await recipe.save();

    res.json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
