import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  images: [], // changed from image: null
  title: "",
  category: "",
  subcategory: "",
  youtubeLink: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  material: "",
  design: "",
  motif: "",
  craftsmanship: "",
  wearability: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]); // changed from imageFile
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]); // changed from uploadedImageUrl
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [categoryData, setCategoryData] = useState({ categories: [], subcategories: [] });

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (currentEditedId && productList.length) {
      const productToEdit = productList.find(p => p._id === currentEditedId);
      if (productToEdit) {
        const { details, ...rest } = productToEdit;
        setFormData({ ...rest, ...(details || {}) });
        setUploadedImageUrls(productToEdit.images || []);
      }
    }
  }, [currentEditedId, productList]);

  function onSubmit(event) {
    event.preventDefault();

    const {
      material,
      design,
      motif,
      craftsmanship,
      wearability,
      ...restFormData
    } = formData;

    const submissionData = {
      ...restFormData,
      details: { material, design, motif, craftsmanship, wearability },
    };

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            // --- MODIFIED START ---
            formData: {
              ...submissionData,
              images: uploadedImageUrls,
            },
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...submissionData,
            images: uploadedImageUrls, // send images array
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFiles([]);
            setFormData(initialFormData);
            toast({
              title: "Product add successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    const requiredFields = [
      "title", "price", "totalStock", "category",
      "material", "design", "motif", "craftsmanship", "wearability"
    ];
    return requiredFields.every(key => formData[key] && formData[key].toString().trim() !== "") && uploadedImageUrls.length > 0;
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (openCreateProductsDialog) {
      fetch("/api/common/categories")
        .then((res) => res.json())
        .then((data) => setCategoryData(data))
        .catch(() => setCategoryData({ categories: [], subcategories: [] }));
    }
  }, [openCreateProductsDialog]);

  //console.log(formData, "productList");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id || productItem.id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setImageFiles([]);
          setUploadedImageUrls([]);
        }}
      >
        <SheetContent
          side="right"
          className="overflow-auto"
          aria-describedby="product-dialog-desc"
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            <span id="product-dialog-desc" className="sr-only">
              Fill out the product details and save to add or edit a product.
            </span>
          </SheetHeader>
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
              categoryData={categoryData}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}



export default AdminProducts;
