const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const Subcategory = require('../../models/Subcategory');

// Get all categories and subcategories
router.get('/', async (req, res) => {
  const categories = await Category.find();
  const subcategories = await Subcategory.find();
  res.json({
    categories: categories.map(c => c.toJSON()),
    subcategories: subcategories.map(s => s.toJSON())
  });
});

// Add category with image
router.post('/', async (req, res) => {
  const { name, image } = req.body;
  const cat = new Category({ name, image });
  await cat.save();
  res.json({ id: cat._id, name: cat.name, image: cat.image });
});

// Update category with image
router.put('/:id', async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { name: req.body.name, image: req.body.image });
  res.sendStatus(200);
});

// Delete category and its subcategories
router.delete('/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  await Subcategory.deleteMany({ categoryId: req.params.id });
  res.sendStatus(200);
});

module.exports = router;
