import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2,
  Check,
  X
} from 'lucide-react';
// import ProductImageUpload from "@/components/admin-view/image-upload"; // Image upload component commented out
import { API_BASE_URL } from "@/config";

function AdminFeatures() {
  // State for categories and subcategories
  const [categoryData, setCategoryData] = useState({ categories: [], subcategories: [] });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState('');
  
  // State for image uploads commented out
  // const [categoryImageFiles, setCategoryImageFiles] = useState([]);
  // const [categoryImageUrls, setCategoryImageUrls] = useState([]);
  // const [categoryImageLoading, setCategoryImageLoading] = useState(false);
  // const [subcategoryImageFiles, setSubcategoryImageFiles] = useState([]);
  // const [subcategoryImageUrls, setSubcategoryImageUrls] = useState([]);
  // const [subcategoryImageLoading, setSubcategoryImageLoading] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/common/categories`)
      .then(res => res.json())
      .then(data => setCategoryData(data))
      .catch(() => setCategoryData({ categories: [], subcategories: [] }));
  }, []);

  // Helper to refresh data after any change
  const refreshCategoryData = () => {
    fetch(`${API_BASE_URL}/common/categories`)
      .then(res => res.json())
      .then(data => setCategoryData(data));
  };

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle edit
  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setNewItemName(item.name);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!newItemName.trim()) return;

    const endpoint = editingItem.type === 'category'
      ? `${API_BASE_URL}/common/categories/${editingItem.id}`
      : `${API_BASE_URL}/common/subcategories/${editingItem.id}`;
    
    await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItemName }),
    });
    
    setEditingItem(null);
    setNewItemName('');
    refreshCategoryData();
  };

  // Handle delete
  const handleDelete = async (id, type) => {
    const endpoint = type === 'category'
      ? `${API_BASE_URL}/common/categories/${id}`
      : `${API_BASE_URL}/common/subcategories/${id}`;

    await fetch(endpoint, { method: 'DELETE' });
    refreshCategoryData();
  };

  // Handle add new category
  const handleAddCategory = async () => {
    // if (!newItemName.trim() || !categoryImageUrls.length) return; // Original check with image
    if (!newItemName.trim()) return; // Check without image
    await fetch(`${API_BASE_URL}/common/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ name: newItemName, image: categoryImageUrls[0] }), // Original body with image
      body: JSON.stringify({ name: newItemName }), // Body without image
    });
    setNewItemName('');
    setIsAddingCategory(false);
    // setCategoryImageFiles([]); // Image state reset commented out
    // setCategoryImageUrls([]); // Image state reset commented out
    refreshCategoryData();
  };

  // Handle add new subcategory
  const handleAddSubcategory = async () => {
    // if (!newItemName.trim() || !selectedCategoryForSubcategory || !subcategoryImageUrls.length) return; // Original check with image
    if (!newItemName.trim() || !selectedCategoryForSubcategory) return; // Check without image
    await fetch(`${API_BASE_URL}/common/subcategories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ name: newItemName, categoryId: selectedCategoryForSubcategory, image: subcategoryImageUrls[0] }), // Original body with image
      body: JSON.stringify({ name: newItemName, categoryId: selectedCategoryForSubcategory }), // Body without image
    });
    setNewItemName('');
    setIsAddingSubcategory(false);
    // setSubcategoryImageFiles([]); // Image state reset commented out
    // setSubcategoryImageUrls([]); // Image state reset commented out
    refreshCategoryData();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        {/* Categories List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Categories</h2>
            <button 
              onClick={() => {
                setIsAddingCategory(true);
                setIsAddingSubcategory(false);
                setNewItemName('');
              }}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Plus size={16} /> Add New Category
            </button>
          </div>

          {isAddingCategory && (
            <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded border">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter new category name"
                className="flex-1 p-2 border rounded"
                autoFocus
              />
              {/* Image Uploader JSX commented out
              <ProductImageUpload
                imageFiles={categoryImageFiles}
                setImageFiles={setCategoryImageFiles}
                uploadedImageUrls={categoryImageUrls}
                setUploadedImageUrls={setCategoryImageUrls}
                setImageLoadingState={setCategoryImageLoading}
                imageLoadingState={categoryImageLoading}
                isCustomStyling={true}
              />
              */}
              <div className="flex">
                <button
                  onClick={handleAddCategory}
                  className="p-2 text-green-500 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  // disabled={categoryImageLoading || !categoryImageUrls.length || !newItemName.trim()} // Original disabled check
                  disabled={!newItemName.trim()}
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => setIsAddingCategory(false)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          <div className="border rounded">
            {categoryData.categories.map(category => (
              <div key={category.id} className="border-b last:border-b-0">
                  <div 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                  <div className="flex items-center gap-2">
                    {expandedCategories[category.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    {editingItem?.id === category.id && editingItem.type === 'category' ? (
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="border p-1 rounded"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{category.name}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingItem?.id === category.id && editingItem.type === 'category' ? (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEditingItem(null); }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEdit(category, 'category'); }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(category.id, 'category'); }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {expandedCategories[category.id] && (
                  <div className="pl-8 bg-gray-50">
                    <div className="flex justify-between items-center p-2 border-t border-b">
                      <h3 className="font-medium text-gray-600">Subcategories</h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAddingSubcategory(true);
                          setIsAddingCategory(false);
                          setSelectedCategoryForSubcategory(category.id);
                          setNewItemName('');
                        }}
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        <Plus size={14} /> Add New Subcategory
                      </button>
                    </div>

                    {isAddingSubcategory && selectedCategoryForSubcategory === category.id && (
                      <div className="flex items-center gap-2 p-2 bg-white border-b">
                        <input
                          type="text"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="Enter new subcategory name"
                          className="flex-1 p-2 border rounded"
                          autoFocus
                        />
                        {/* Image Uploader JSX commented out
                        <ProductImageUpload
                          imageFiles={subcategoryImageFiles}
                          setImageFiles={setSubcategoryImageFiles}
                          uploadedImageUrls={subcategoryImageUrls}
                          setUploadedImageUrls={setSubcategoryImageUrls}
                          setImageLoadingState={setSubcategoryImageLoading}
                          imageLoadingState={subcategoryImageLoading}
                          isCustomStyling={true}
                        />
                        */}
                        <div className="flex">
                            <button
                                onClick={handleAddSubcategory}
                                className="p-2 text-green-500 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                // disabled={subcategoryImageLoading || !subcategoryImageUrls.length || !newItemName.trim()} // Original disabled check
                                disabled={!newItemName.trim()}
                            >
                                <Check size={16} />
                            </button>
                            <button
                                onClick={() => setIsAddingSubcategory(false)}
                                className="p-2 text-red-500 hover:text-red-700"
                            >
                                <X size={16} />
                            </button>
                        </div>
                      </div>
                    )}

                    {categoryData.subcategories
                      .filter(sub => sub.categoryId === category.id)
                      .map(subcategory => (
                        <div key={subcategory.id} className="flex justify-between items-center p-2 border-b last:border-b-0 hover:bg-gray-100">
                          {editingItem?.id === subcategory.id && editingItem.type === 'subcategory' ? (
                            <input
                              type="text"
                              value={newItemName}
                              onChange={(e) => setNewItemName(e.target.value)}
                              className="border p-1 rounded flex-1"
                              autoFocus
                            />
                          ) : (
                            <span className="text-sm">{subcategory.name}</span>
                          )}
                          <div className="flex gap-2">
                            {editingItem?.id === subcategory.id && editingItem.type === 'subcategory' ? (
                              <>
                                <button onClick={handleSaveEdit} className="text-green-500 hover:text-green-700">
                                  <Check size={16} />
                                </button>
                                <button onClick={() => setEditingItem(null)} className="text-red-500 hover:text-red-700">
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleEdit(subcategory, 'subcategory')} className="text-blue-500 hover:text-blue-700">
                                  <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(subcategory.id, 'subcategory')} className="text-red-500 hover:text-red-700">
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFeatures;