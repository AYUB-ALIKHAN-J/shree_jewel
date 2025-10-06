import { FileIcon, UploadCloudIcon, XIcon, PlusIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { API_BASE_URL } from "../../config";

// Configure axios for larger file uploads
const uploadAxios = axios.create({
  maxContentLength: 8 * 1024 * 1024, // 8MB
  maxBodyLength: 8 * 1024 * 1024, // 8MB
  timeout: 180000, // 3 minutes timeout
});

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
  const [uploadProgress, setUploadProgress] = useState(0);

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
  }

  function handleRemoveExistingImage(idx) {
    const newUrls = [...uploadedImageUrls];
    newUrls.splice(idx, 1);
    setUploadedImageUrls(newUrls);
  }

  function extractPublicId(url) {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return `shree_jewell/${filename.split('.')[0]}`;
  }

  async function deleteImageFromCloudinary(url) {
    try {
      const publicId = extractPublicId(url);
      await axios.post(`${API_BASE_URL}/admin/products/delete-image`, { publicId });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    setUploadProgress(0);
    const data = new FormData();
    imageFiles.forEach((file) => data.append("my_file", file));
    const response = await uploadAxios.post(
      `${API_BASE_URL}/admin/products/upload-image`,
      data,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      }
    );
    if (response?.data?.success) {
      const urls = (response.data.results || [])
        .map((r) => r.url)
        .filter(Boolean);
      setUploadedImageUrls(prev => [...prev, ...urls]);
      setImageFiles([]);
      setImageLoadingState(false);
      setUploadProgress(0);
    }
  }

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) uploadImageToCloudinary();
  }, [imageFiles]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>
      
      {/* Existing Images */}
      {uploadedImageUrls.length > 0 && (
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Current Images</Label>
          <div className="grid grid-cols-2 gap-2">
            {uploadedImageUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={url} 
                  alt={`Product ${idx + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveExistingImage(idx)}
                >
                  <XIcon className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Images */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4"
      >
        <Input
          id={inputId}
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          multiple={!single}
          accept="image/*"
        />
        {(!imageFiles || imageFiles.length === 0) ? (
          <Label
            htmlFor={inputId}
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            {isEditMode ? (
              <>
                <PlusIcon className="w-10 h-10 text-muted-foreground mb-2" />
                <span>Add more images</span>
              </>
            ) : (
              <>
                <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                <span>Drag & drop or click to upload images</span>
              </>
            )}
          </Label>
        ) : imageLoadingState ? (
          <>
            <Skeleton className="h-10 bg-gray-100" />
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</div>
          </>
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
