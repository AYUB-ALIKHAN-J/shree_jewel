import { Search } from "lucide-react";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// API Configuration
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '139.59.34.72';
console.log(API_BASE_URL);


export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Material",
    name: "material",
    componentType: "textarea",
    placeholder: "Enter product material details",
  },
  {
    label: "Design",
    name: "design",
    componentType: "textarea",
    placeholder: "Enter product design details",
  },
  {
    label: "Motif",
    name: "motif",
    componentType: "textarea",
    placeholder: "Enter product motif details",
  },
  {
    label: "Craftsmanship",
    name: "craftsmanship",
    componentType: "textarea",
    placeholder: "Enter product craftsmanship details",
  },
  {
    label: "Wearability",
    name: "wearability",
    componentType: "textarea",
    placeholder: "Enter product wearability details",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    optionsKey: "categories",
    placeholder: "Select a category",
  },
  {
    label: "Subcategory",
    name: "subcategory",
    componentType: "select",
    optionsKey: "subcategories",
    placeholder: "Select a subcategory",
  },
  {
    label: "YouTube Link",
    name: "youtubeLink",
    componentType: "input",
    type: "text",
    placeholder: "Enter YouTube video link (optional)",
  },
 
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
   { 
    id: "about", 
    label: "About Us", 
    path: "/shop/about-us" 
  }, 
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "",
    icon: Search,
    path: "/shop/search",
  },
];

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
    pattern: "^\\d{6}$",
    maxLength: 6,
    minLength: 6,
    validate: (val) => /^\d{6}$/.test(val),
    errorMessage: "Pincode must be exactly 6 digits.",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "tel",
    placeholder: "Enter your phone number",
    pattern: "^\\d{10}$",
    maxLength: 10,
    minLength: 10,
    validate: (val) => /^\d{10}$/.test(val),
    errorMessage: "Phone number must be exactly 10 digits.",
  },
  {
    label: "Gift for someone else?",
    name: "isGift",
    componentType: "checkbox",
    defaultValue: false,
  },
  {
    label: "Gift Message",
    name: "giftMessage",
    componentType: "textarea",
    placeholder: "Message to be written on the card before delivery",
    showIf: (formData) => !!formData.isGift,
    requiredIf: (formData) => !!formData.isGift,
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
    required: false,
  },
];
