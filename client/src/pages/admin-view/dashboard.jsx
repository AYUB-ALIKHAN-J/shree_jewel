import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "@/config";
import { Check, X, Plus } from "lucide-react";

function BannerManager() {
  const [featureDesktopFiles, setFeatureDesktopFiles] = useState([]);
  const [featureDesktopUrls, setFeatureDesktopUrls] = useState([]);
  const [featureDesktopLoading, setFeatureDesktopLoading] = useState(false);
  const [featureMobileFiles, setFeatureMobileFiles] = useState([]);
  const [featureMobileUrls, setFeatureMobileUrls] = useState([]);
  const [featureMobileLoading, setFeatureMobileLoading] = useState(false);
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [featureList, setFeatureList] = useState([]);

  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrls.length) return;
    Promise.all(
      uploadedImageUrls.map((url) => dispatch(addFeatureImage(url)))
    ).then(() => {
      dispatch(getFeatureImages());
      setImageFiles([]);
      setUploadedImageUrls([]);
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  const fetchFeatureImages = async () => {
    const res = await fetch(`${API_BASE_URL}/common/feature/get`);
    const data = await res.json();
    setFeatureList(data.data || []);
  };

  useEffect(() => {
    fetchFeatureImages();
  }, []);

  const handleAddFeature = async () => {
    if (!featureDesktopUrls.length || !featureMobileUrls.length) return;
    await fetch(`${API_BASE_URL}/common/feature/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageDesktop: featureDesktopUrls[0],
        imageMobile: featureMobileUrls[0],
      }),
    });
    setFeatureDesktopFiles([]);
    setFeatureDesktopUrls([]);
    setFeatureDesktopLoading(false);
    setFeatureMobileFiles([]);
    setFeatureMobileUrls([]);
    setFeatureMobileLoading(false);
    setIsAddingFeature(false);
    fetchFeatureImages();
  };

  const handleDeleteFeature = async (id) => {
    await fetch(`${API_BASE_URL}/common/feature/delete/${id}`, {
      method: "DELETE",
    });
    fetchFeatureImages();
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Feature Banners</h2>
        <button
          onClick={() => setIsAddingFeature(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Plus size={16} /> Add New Banner
        </button>
      </div>
      {isAddingFeature && (
        <div className="flex flex-col gap-4 mb-4 p-4 bg-gray-50 rounded border border-yellow-400">
          <div>
            <label className="font-semibold block mb-1">
              Desktop/Laptop Banner Image{" "}
              <span className="text-red-500">*</span>
            </label>
            <ProductImageUpload
              imageFiles={featureDesktopFiles}
              setImageFiles={setFeatureDesktopFiles}
              uploadedImageUrls={featureDesktopUrls}
              setUploadedImageUrls={setFeatureDesktopUrls}
              setImageLoadingState={setFeatureDesktopLoading}
              imageLoadingState={featureDesktopLoading}
              isCustomStyling={true}
              single={true} // Only one image allowed
              inputId="desktop-image-upload"
            />
            {!featureDesktopUrls.length && (
              <p className="text-sm text-red-500 mt-1">
                Desktop image is required.
              </p>
            )}
          </div>
          <div>
            <label className="font-semibold block mb-1">
              Mobile Banner Image <span className="text-red-500">*</span>
            </label>
            <ProductImageUpload
              imageFiles={featureMobileFiles}
              setImageFiles={setFeatureMobileFiles}
              uploadedImageUrls={featureMobileUrls}
              setUploadedImageUrls={setFeatureMobileUrls}
              setImageLoadingState={setFeatureMobileLoading}
              imageLoadingState={featureMobileLoading}
              isCustomStyling={true}
              single={true} // Only one image allowed
              inputId="mobile-image-upload"
            />
            {!featureMobileUrls.length && (
              <p className="text-sm text-red-500 mt-1">
                Mobile image is required.
              </p>
            )}
          </div>
          <button
            onClick={handleAddFeature}
            className="p-2 text-green-500 hover:text-green-700 border border-green-500 rounded disabled:opacity-50"
            disabled={
              featureDesktopLoading ||
              featureMobileLoading ||
              !featureDesktopUrls.length ||
              !featureMobileUrls.length
            }
          >
            <Check size={20} /> Upload Banner
          </button>
          <button
            onClick={() => setIsAddingFeature(false)}
            className="p-2 text-red-500 hover:text-red-700 border border-red-500 rounded"
          >
            <X size={20} /> Cancel
          </button>
        </div>
      )}
      <div className="flex flex-col gap-4 mt-5">
        {featureList && featureList.length > 0 ? (
          featureList.map((featureImgItem) => (
            <div
              className="relative"
              key={featureImgItem._id || featureImgItem.id}
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="block font-semibold mb-1">Desktop</span>
                  <img
                    src={featureImgItem.imageDesktop}
                    className="w-full h-[180px] object-cover rounded-lg border"
                    alt="Desktop Banner"
                  />
                </div>
                <div className="flex-1">
                  <span className="block font-semibold mb-1">Mobile</span>
                  <img
                    src={featureImgItem.imageMobile}
                    className="w-full h-[180px] object-cover rounded-lg border"
                    alt="Mobile Banner"
                  />
                </div>
                <button
                  onClick={() =>
                    handleDeleteFeature(featureImgItem._id || featureImgItem.id)
                  }
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                  title="Delete Image"
                >
                  &#10005;
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No banners added yet.</p>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <BannerManager />
    </div>
  );
}
