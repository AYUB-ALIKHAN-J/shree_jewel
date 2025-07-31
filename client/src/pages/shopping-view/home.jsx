import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { useNavigate } from "react-router-dom";
import ReviewCarousel from "@/components/common/ReviewCarousel";
import { formatPriceWithTax } from "@/lib/utils";
// Import the new component you just created
import CollectionsSection from "@/components/shopping-view/CollectionsSection";


function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    if (!user) {
      toast({
        title: "Please login to add items to cart",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    const product = productList.find((item) => item._id === getCurrentProductId);
    const totalStock = product?.totalStock ?? 0;

    const getCartItems = cartItems?.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > totalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (featureImageList && featureImageList.length > 1) {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
      }, 5000);

    return () => clearInterval(timer);
    }
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredFeatureImages = featureImageList
    ? featureImageList.filter((slide) =>
        isMobile ? !!slide?.imageMobile : !!slide?.imageDesktop
      )
    : [];

  const cartArray = cartItems?.items || [];

  function MobileCartBar({ cartItems, onCheckout }) {
    const subtotal = cartItems.reduce(
      (sum, item) =>
        sum + formatPriceWithTax(
          (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity
        ).priceWithTax,
      0
    );
    
    const handleCheckout = () => {
      if (!user) {
        toast({
          title: "Please login to checkout",
          description: "You need to be logged in to complete your purchase",
          variant: "destructive",
        });
        navigate("/auth/login");
        return;
      }
      onCheckout();
    };
    
    return (
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-bold">Cart: {cartItems.length} item(s)</span>
        <span className="font-bold">₹{subtotal.toFixed(2)}</span>
        <Button size="sm" onClick={handleCheckout} className="ml-2">Checkout</Button>
      </div>
    );
  }

  let inStock = (productList || []).filter((p) => (p.totalStock ?? 0) > 0).reverse();
  let outOfStock = (productList || []).filter((p) => (p.totalStock ?? 0) <= 0);
  let combined = [...outOfStock, ...inStock];
  let last8 = combined.slice(-8).reverse();

  return (
    <div className="flex flex-col min-h-screen">
        {/* Banner Section */}
        <div className="relative w-full h-[920px] mt-16 overflow-hidden">
            {filteredFeatureImages && filteredFeatureImages.length > 0 ? (
            filteredFeatureImages.map((slide, index) => (
                <img
                src={isMobile ? slide?.imageMobile : slide?.imageDesktop}
                alt={slide?.alt || "Feature banner"}
                key={"feature-image-" + (slide?._id || index)}
                className={`${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                />
            ))
            ) : (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-lg">No feature images available</p>
            </div>
            )}
            {filteredFeatureImages && filteredFeatureImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                {filteredFeatureImages.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-5 h-5 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all duration-300
                    ${index === currentSlide
                        ? "bg-[#D4AF37] border-[#D4AF37] scale-125 shadow-lg opacity-100"
                        : "bg-white/70 border-[#1B5E20] hover:scale-110 opacity-70"}
                    `}
                    aria-label={`Go to slide ${index + 1}`}
                />
                ))}
            </div>
            )}
        </div>
      
        {/* Our Collections Section - Now using the new component */}
        <CollectionsSection />

        {/* --- Rest of your page content --- */}
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-[#1B5E20] border-b-4 border-[#D4AF37] inline-block pb-2 px-6 rounded-full bg-white/80 shadow">
                    Feature Products
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 p-2 sm:p-4">
                    {last8.length > 0
                    ? last8.map((productItem) => (
                        <ShoppingProductTile
                            key={productItem._id}
                            handleGetProductDetails={handleGetProductDetails}
                            product={productItem}
                            handleAddtoCart={handleAddtoCart}
                        />
                        ))
                    : null}
                </div>
            </div>
        </section>

        {isMobile && cartArray.length > 0 && (
            <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 shadow-lg">
                <div className="max-w-lg mx-auto">
                    <MobileCartBar cartItems={cartArray} onCheckout={() => navigate("/shop/checkout")} />
                </div>
            </div>
        )}
        <ProductDetailsDialog
            open={openDetailsDialog}
            setOpen={setOpenDetailsDialog}
            productDetails={productDetails}
        />
        <ReviewCarousel />
    </div>
  );
}

export default ShoppingHome;