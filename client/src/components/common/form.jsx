import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  categoryData = { categories: [], subcategories: [] }, // NEW: accept categoryData as prop
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    // Special handling for category and subcategory
    if (getControlItem.name === "category") {
      element = (
        <Select
          onValueChange={(value) =>
            setFormData({
              ...formData,
              category: value,
              subcategory: "", // reset subcategory when category changes
            })
          }
          value={formData.category || ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categoryData.categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (getControlItem.name === "subcategory") {
      element = (
        <Select
          onValueChange={(value) =>
            setFormData({
              ...formData,
              subcategory: value,
            })
          }
          value={formData.subcategory || ""}
          disabled={!formData.category}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Subcategory" />
          </SelectTrigger>
          <SelectContent>
            {categoryData.subcategories
              .filter((sub) => sub.categoryId === formData.category)
              .map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      );
    } else {
      switch (getControlItem.componentType) {
        case "input":
          element = (
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />
          );

          break;
        case "select":
      // NEW: Native select support
          if (getControlItem.useNative) {
            element = (
              <select
                value={formData[getControlItem.name]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [getControlItem.name]: e.target.value,
                  }))
                }
                className="input-class"
              >
                <option value="">{getControlItem.placeholder}</option>
                {categoryData?.[getControlItem.optionsKey]?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            );
          } else {
            // ...existing custom Select component...
            element = (
              <Select
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: value,
                  })
                }
                value={value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={getControlItem.label} />
                </SelectTrigger>
                <SelectContent>
                  {getControlItem.options && getControlItem.options.length > 0
                    ? getControlItem.options.map((optionItem) => (
                        <SelectItem key={optionItem.id} value={optionItem.id}>
                          {optionItem.label}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
            );
          }
          break;
        case "textarea":
          element = (
            <Textarea
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.id}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />
          );

          break;
        case "checkbox":
          element = (
            <input
              type="checkbox"
              id={getControlItem.name}
              name={getControlItem.name}
              checked={!!formData[getControlItem.name]}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.checked,
                })
              }
              className="w-4 h-4 accent-primary mr-2"
            />
          );
          break;
        default:
          element = (
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />
          );
          break;
      }
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => {
          // Only render if showIf is not defined or returns true
          if (typeof controlItem.showIf === "function" && !controlItem.showIf(formData)) {
            return null;
          }
          return (
            <div className="grid w-full gap-1.5" key={controlItem.name}>
              <Label className="mb-1">{controlItem.label}</Label>
              {renderInputsByComponentType(controlItem)}
            </div>
          );
        })}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
