const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recipes = await Recipe.find({ author: req.params.id }).select('title image cuisine category averageRating');

    res.json({ success: true, user, recipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile (authenticated)
router.put('/me/profile', authenticate, async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, bio, avatar, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add recipe to favorites
router.post('/favorites/:recipeId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (!user.favoriteRecipes.includes(req.params.recipeId)) {
      user.favoriteRecipes.push(req.params.recipeId);
      await user.save();
    }

    res.json({ success: true, message: 'Recipe added to favorites', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove recipe from favorites
router.delete('/favorites/:recipeId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.favoriteRecipes = user.favoriteRecipes.filter(id => id.toString() !== req.params.recipeId);
    await user.save();

    res.json({ success: true, message: 'Recipe removed from favorites', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's favorite recipes
router.get('/:id/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favoriteRecipes');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, favorites: user.favoriteRecipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
