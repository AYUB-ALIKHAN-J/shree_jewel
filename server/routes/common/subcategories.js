const express = require('express');
const router = express.Router();
const Subcategory = require('../../models/Subcategory');

// Add subcategory with image
router.post('/', async (req, res) => {
  const { name, categoryId, image } = req.body;
  const sub = new Subcategory({ name, categoryId, image });
  await sub.save();
  res.json(sub.toJSON());
});

// Update subcategory with image
router.put('/:id', async (req, res) => {
  await Subcategory.findByIdAndUpdate(req.params.id, { name: req.body.name, image: req.body.image });
  res.sendStatus(200);
});

// Delete subcategory
router.delete('/:id', async (req, res) => {
  await Subcategory.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

module.exports = router;
