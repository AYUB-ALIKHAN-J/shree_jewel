import { Fragment, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { API_BASE_URL } from "../../config";

function ProductFilter({ filters, handleFilter }) {
  const [categoryData, setCategoryData] = useState({ categories: [], subcategories: [] });

  useEffect(() => {
    fetch(`${API_BASE_URL}/common/categories`)
      .then(res => res.json())
      .then(data => {
        setCategoryData(data);
        // Log all subcategory names
        if (Array.isArray(data.subcategories)) {
          //console.log("Subcategory names:", data.subcategories.map(sub => sub.name));
        }
      })
      .catch(() => setCategoryData({ categories: [], subcategories: [] }));
  }, []);

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Category Filter */}
        <div>
          <h3 className="text-base font-bold">Category</h3>
          <div className="grid gap-2 mt-2">
            {categoryData.categories.map((option) => (
              <Label key={option.id} className="flex font-medium items-center gap-2 ">
                <Checkbox
                  checked={
                    filters &&
                    filters.category &&
                    filters.category.indexOf(option.name) > -1
                  }
                  onCheckedChange={() => handleFilter("category", option.name)}
                />
                {option.name}
              </Label>
            ))}
          </div>
        </div>
        <Separator />
        {/* Subcategory Filter */}
        <div>
          <h3 className="text-base font-bold">Subcategory</h3>
          <div className="grid gap-2 mt-2">
            {categoryData.subcategories.map((option) => (
              <Label key={option.id} className="flex font-medium items-center gap-2 ">
                <Checkbox
                  checked={
                    filters &&
                    filters.subcategory &&
                    filters.subcategory.indexOf(option.name) > -1
                  }
                  onCheckedChange={() => handleFilter("subcategory", option.name)}
                />
                
                {option.name}
              </Label>
            ))}
          </div>
        </div>
        <Separator />
      </div>
    </div>
  );
}

export default ProductFilter;
