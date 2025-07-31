import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { API_BASE_URL } from "../../config";

function ProductImageUpload({
  imageFiles,
  setImageFiles,
  imageLoadingState,
  uploadedImageUrls,
  setUploadedImageUrls,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  single = false,
  inputId = "image-upload", // NEW PROP
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    let selectedFiles = Array.from(event.target.files || []);
    if (single && selectedFiles.length) selectedFiles = [selectedFiles[0]];
    if (selectedFiles.length) setImageFiles(selectedFiles);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    let droppedFiles = Array.from(event.dataTransfer.files || []);
    if (single && droppedFiles.length) droppedFiles = [droppedFiles[0]];
    if (droppedFiles.length) setImageFiles(droppedFiles);
  }

  function handleRemoveImage(idx) {
    const newFiles = [...imageFiles];
    newFiles.splice(idx, 1);
    setImageFiles(newFiles);
    const newUrls = [...uploadedImageUrls];
    newUrls.splice(idx, 1);
    setUploadedImageUrls(newUrls);
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    imageFiles.forEach((file) => data.append("my_file", file));
    const response = await axios.post(
      `${API_BASE_URL}/admin/products/upload-image`,
      data
    );
    if (response?.data?.success) {
      const urls = (response.data.results || [])
        .map((r) => r.url)
        .filter(Boolean);
      setUploadedImageUrls(urls);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) uploadImageToCloudinary();
  }, [imageFiles]);

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`$${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id={inputId}
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
          multiple={!single}
          accept="image/*"
        />
        {(!imageFiles || imageFiles.length === 0) ? (
          <Label
            htmlFor={inputId}
            className={`$${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex flex-col gap-2">
            {imageFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileIcon className="w-8 text-primary mr-2 h-8" />
                  <p className="text-sm font-medium">{file.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveImage(idx)}
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Remove File</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
