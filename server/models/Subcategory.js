const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String } // Add image field
},
{ 
  timestamps: true 
});

SubcategorySchema.method('toJSON', function() {
  const { _id, ...object } = this.toObject();
  object.id = _id.toString();
  object.categoryId = object.categoryId.toString();
  return object;
});

module.exports = mongoose.model('Subcategory', SubcategorySchema);
