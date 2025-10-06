import PropTypes from "prop-types";

function ProductForm({ formData, setFormData, categoryData = { categories: [], subcategories: [] }, ...props }) {
  return (
    <form onSubmit={props.onSubmit}>
      {/* ...other form fields... */}
      <label htmlFor="category-select">Category</label>
      <select
        id="category-select"
        name="category"
        value={formData.category}
        onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: "" })}
      >
        <option value="">Select Category</option>
        {categoryData.categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <label htmlFor="subcategory-select">Subcategory</label>
      <select
        id="subcategory-select"
        name="subcategory"
        value={formData.subcategory}
        onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
        disabled={!formData.category}
      >
        <option value="">Select Subcategory</option>
        {categoryData.subcategories
          .filter(sub => sub.categoryId === formData.category)
          .map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
      </select>
      {/* ...other form fields... */}
      <button type="submit" style={{ display: "none" }}></button>
    </form>
  );
}

ProductForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  categoryData: PropTypes.shape({
    categories: PropTypes.array,
    subcategories: PropTypes.array,
  }),
  onSubmit: PropTypes.func,
};

export default ProductForm;