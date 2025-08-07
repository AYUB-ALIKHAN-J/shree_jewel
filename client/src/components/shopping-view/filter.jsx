import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { API_BASE_URL } from "../../config";
import { X } from "lucide-react";
import { Button } from "../ui/button";

// The component now accepts an `isCartVisible` prop to know when the checkout bar is shown.
function ProductFilter({ filters, handleFilter, isMobile, isCartVisible }) {
  const [categoryData, setCategoryData] = useState({ categories: [], subcategories: [] });
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/common/categories`)
      .then(res => res.json())
      .then(data => {
        setCategoryData(data);
      })
      .catch(() => setCategoryData({ categories: [], subcategories: [] }));
  }, []);

  const selectedCategories = filters?.category || [];

  const availableSubcategories = categoryData.subcategories.filter(sub => {
    if (selectedCategories.length === 0) return false;
    const parentCategory = categoryData.categories.find(cat => cat.id === sub.categoryId);
    return parentCategory && selectedCategories.includes(parentCategory.name);
  });

  const handleCategoryFilter = (categoryName) => {
    let newFilters = { ...filters };
    if (newFilters.subcategory) {
      delete newFilters.subcategory;
    }
    const index = (newFilters.category || []).indexOf(categoryName);
    if (index === -1) {
      newFilters = { ...newFilters, category: [...(newFilters.category || []), categoryName] };
    } else {
      newFilters.category.splice(index, 1);
      if (newFilters.category.length === 0 && newFilters.subcategory) {
        delete newFilters.subcategory;
      }
    }
    handleFilter("category", categoryName, newFilters);
  };

  function renderFilters() {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold">Category</h3>
          <div className="grid gap-2 mt-2">
            {categoryData.categories.map(option => {
              const isChecked = filters?.category && filters.category.includes(option.name);
              return (
                <Label key={option.id} className="flex font-medium items-center gap-2 ">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleCategoryFilter(option.name)}
                  />
                  {option.name}
                </Label>
              );
            })}
          </div>
        </div>
        {selectedCategories.length > 0 && availableSubcategories.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-base font-bold">Subcategory</h3>
              <div className="grid gap-2 mt-2">
                {availableSubcategories.map(option => (
                  <Label key={option.id} className="flex font-medium items-center gap-2 ">
                    <Checkbox
                      checked={filters?.subcategory && filters.subcategory.includes(option.name)}
                      onCheckedChange={() => handleFilter("subcategory", option.name)}
                    />
                    {option.name}
                  </Label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {isMobile && (
        <>
          <Button
            variant="outline"
            className="w-full mb-3"
            onClick={() => setFilterPanelOpen(true)}
          >
            Filters
          </Button>

          {filterPanelOpen && (
            // This container is now conditionally positioned based on cart visibility.
            <div className={`fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-30 flex flex-col transition-all duration-300 ${isCartVisible ? 'bottom-16' : 'bottom-0'}`}>
              <div
                className="bg-white w-full h-full mt-auto rounded-t-lg shadow-lg overflow-hidden animate-slide-in-up flex flex-col"
                style={{
                  animation: "slideup 0.3s cubic-bezier(.18,.89,.32,1.28)"
                }}
              >
                <div className="flex justify-between items-center p-4 border-b font-bold sticky top-0 bg-white z-10">
                  <span>Filters</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFilterPanelOpen(false)}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* The scrollable area has fixed padding to clear its own footer. */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                  {renderFilters()}
                </div>

                {/* The button's container is always sticky to the bottom of its parent. */}
                <div className="p-4 border-t sticky bottom-0 bg-white z-10">
                  <Button
                    className="w-full h-12 text-base"
                    onClick={() => setFilterPanelOpen(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {!isMobile && (
        <div className="bg-background rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-extrabold">Filters</h2>
          </div>
          <div className="p-4 space-y-4">{renderFilters()}</div>
        </div>
      )}

      <style>{`
        @keyframes slideup {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

ProductFilter.propTypes = {
    filters: PropTypes.object.isRequired,
    handleFilter: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    isCartVisible: PropTypes.bool, // This new prop controls the button position
};

export default ProductFilter;
