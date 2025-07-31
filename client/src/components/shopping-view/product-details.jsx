import { X, ShoppingCart, Truck, Shield, RotateCcw, Heart, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems, updateCartQuantity, deleteCartItem } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import YoutubeEmbed from "../common/YoutubeEmbed";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatPriceWithTax } from "@/lib/utils";

// --- START: Enhanced ProductImagesCarousel Component ---
function ProductImagesCarousel({ images, title, newArrival = false }) {
  const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);
  const [zoom, setZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentMainImageIndex(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  const handleThumbnailClick = (index) => {
    setCurrentMainImageIndex(index);
    if (thumbnailContainerRef.current) {
      const selectedThumbnail = thumbnailContainerRef.current.children[index];
      if (selectedThumbnail) {
        selectedThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // --- MAGNIFIER LENS HANDLERS ---
  const magnifierSize = 120; // px, diameter of the lens (reduced from 180)
  const zoomLevel = 2.5; // increase for more zoom

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoomPosition({ x, y, width: rect.width, height: rect.height });
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {/* Main Image (Top) with Magnifier Lens */}
      <div
        className="relative flex flex-col justify-start items-center overflow-visible rounded-xl aspect-[9/16] w-full max-w-full mb-0"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
        style={{ cursor: zoom ? 'zoom-in' : 'pointer', marginBottom: 0 }}
      >
        <img
          src={images[currentMainImageIndex]}
          alt={title}
          className="w-full h-auto object-cover rounded-xl transition-opacity duration-500 aspect-[9/16]"
          style={{ display: 'block', margin: 0, padding: 0 }}
        />
        {/* MAGNIFIER LENS (rectangular, 16:9 aspect) */}
        {zoom && zoomPosition.x && (
          <div
            className="hidden md:block lg:block pointer-events-none aspect-[9/16]"
            style={{
              position: 'absolute',
              left: `${zoomPosition.x - magnifierSize / 2}px`,
              top: `${zoomPosition.y - magnifierSize * 16 / 9 / 2}px`, // maintain 16:9 aspect
              width: `${magnifierSize}px`,
              height: `${magnifierSize * 16 / 9}px`,
              boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
              border: '2px solid var(--border)',
              background: `url('${images[currentMainImageIndex]}') no-repeat`,
              backgroundSize: `${zoomPosition.width * zoomLevel}px ${zoomPosition.height * zoomLevel}px`,
              backgroundPosition: `-${zoomPosition.x * zoomLevel - magnifierSize / 2}px -${zoomPosition.y * zoomLevel - (magnifierSize * 16 /9) / 2}px`,
              zIndex: 20,
            }}
          />
        )}
      </div>
      {/* Thumbnails (Below Main Image) */}
      {images.length > 1 && (
        <div
          ref={thumbnailContainerRef}
          className="flex flex-row gap-1 overflow-x-auto max-w-full scrollbar-hide mt-0"
          style={{ flexShrink: 0, marginTop: 0, paddingTop: 0 }}
        >
          {images.map((imgSrc, index) => (
            <button
              key={index}
              className={`w-12 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentMainImageIndex ? 'border-[var(--primary)] shadow-md' : 'border-transparent hover:border-[var(--border)]'
              }`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={imgSrc}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// --- END: Enhanced ProductImagesCarousel Component ---


// --- START: AccordionSection Component ---
function AccordionSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)] py-4">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title.replace(/\s/g, '-')}`}
      >
        <h3 className="text-xl font-bold text-[var(--foreground)]">
          {title}
        </h3>
        <ChevronDown className={`w-5 h-5 text-[var(--foreground)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div id={`accordion-content-${title.replace(/\s/g, '-')}`} className="pt-4 text-[var(--foreground)] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
// --- END: AccordionSection Component ---


function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const navigate = useNavigate();

  const { toast } = useToast();

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!user) {
      toast({
        title: "Please login to add items to cart",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
  }

  function handlePolicyClick() {
    navigate("/shop/about-us#policies");
  }

  const cartItem = cartItems?.items?.find((item) => item.productId === productDetails?._id);

  function handleUpdateQuantity(type) {
    if (!user) {
      toast({
        title: "Please login to manage your cart",
        description: "You need to be logged in to update cart items",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    if (!cartItem) return;
    const newQty = type === "plus" ? cartItem.quantity + 1 : cartItem.quantity - 1;
    if (newQty < 1) return;
    dispatch(updateCartQuantity({
      userId: user?.id,
      productId: productDetails._id,
      quantity: newQty,
    })).then(() => dispatch(fetchCartItems(user?.id)));
  }

  function handleRemoveFromCart() {
    if (!user) {
      toast({
        title: "Please login to manage your cart",
        description: "You need to be logged in to remove cart items",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    if (!cartItem) return;
    dispatch(deleteCartItem({ userId: user?.id, productId: productDetails._id }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({ title: "Removed from cart" });
        }
      });
  }

  const collectionName = productDetails?.collection || "Signature Collection";
  const productCategory = productDetails?.category || "Jewelry";

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
        // Luxury redesign: solid white background, gold border, elegant shadow
        className="p-0 max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[1400px] max-h-[98vh] overflow-hidden bg-[var(--card)] border-2 border-[var(--border)] shadow-2xl flex rounded-2xl"
      >
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <DialogDescription className="sr-only">View detailed information about this product</DialogDescription>

        {/* Main Grid Layout (Image on left, details on right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full min-h-full">
          {/* Product Images Column - Left Side */}
          <div className="p-4 md:p-6 flex flex-col items-center justify-start overflow-y-auto">
            {productDetails?.images && productDetails.images.length > 0 ? (
              <ProductImagesCarousel images={productDetails.images} title={productDetails?.title} newArrival={productDetails?.isNewArrival} />
            ) : (
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}
          </div>

          {/* Product Details Column - Right Side (Scrollable) */}
          <div className="relative flex flex-col p-4 md:p-6 border-l-2 border-[var(--border)] bg-[var(--card)] shadow-lg rounded-r-2xl overflow-y-auto">
            {/* Collection / Category Name - Subtle and Uppercase */}
            <p className="text-[var(--muted-foreground)] uppercase text-sm tracking-wide mb-2 font-sans">
              {collectionName} for {productCategory}
            </p>

            {/* Product Title - Prominent and Elegant Serif */}
            <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-6 leading-tight tracking-tight drop-shadow-lg">
              {productDetails?.title}
            </h1>

            {/* Price Section - Clean and Prominent */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4">
                {productDetails?.salePrice > 0 ? (
                  <>
                    <span className="text-5xl md:text-6xl font-extrabold text-[var(--primary)] drop-shadow-lg">
                    ₹{formatPriceWithTax(productDetails?.salePrice).displayPrice}
                    </span>
                    <span className="text-2xl md:text-3xl font-medium text-[var(--muted-foreground)] line-through">
                    ₹{formatPriceWithTax(productDetails?.price).displayPrice}
                    </span>
                    <span className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-3 py-1 rounded-full text-lg font-bold shadow">
                      {Math.round(((productDetails?.price - productDetails?.salePrice) / productDetails?.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-5xl md:text-6xl font-extrabold text-[var(--primary)] drop-shadow-lg">
                    ₹{formatPriceWithTax(productDetails?.price).displayPrice}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                  Inclusive of taxes
                </div>
                {productDetails?.salePrice > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">You save:</span>
                    <span className="text-lg font-bold text-red-600">
                      ₹{(productDetails?.price - productDetails?.salePrice).toFixed(2)}
                    </span>
                  </div>
                )}
            </div>

            {/* Size Selector - Placeholder for future functionality */}
            <div className="mb-6">
                <label htmlFor="size-select" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    Size:
                </label>
                <select id="size-select" className="w-full p-3 border border-[var(--border)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors">
                    <option value="">Select Size</option>
                    <option value="small">Small (6.5")</option>
                    <option value="medium">Medium (7.0")</option>
                    <option value="large">Large (7.5")</option>
                </select>
            </div>

            {/* Add to Cart / Quantity Controls */}
            <div className="mb-8 flex items-center gap-3">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full h-14 text-lg font-semibold bg-[var(--muted-foreground)] cursor-not-allowed rounded-full text-[var(--background)] opacity-70" disabled>
                  Out of Stock
                </Button>
              ) : cartItem ? (
                <div className="flex items-center w-full gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] rounded-full shadow-md"
                    disabled={cartItem.quantity === 1}
                    onClick={() => handleUpdateQuantity("minus")}
                  >
                    -
                  </Button>
                  <span className="font-semibold text-xl w-12 text-center text-[var(--foreground)]">
                    {cartItem.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] rounded-full shadow-md"
                    disabled={cartItem.quantity >= productDetails.totalStock}
                    onClick={() => handleUpdateQuantity("plus")}
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 text-[var(--destructive)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] rounded-full"
                    onClick={handleRemoveFromCart}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    className="flex-grow h-14 text-lg font-semibold bg-[var(--primary)] hover:bg-[var(--accent)] shadow-lg rounded-full text-[var(--primary-foreground)]"
                    onClick={() =>
                      handleAddToCart(
                        productDetails?._id,
                        productDetails?.totalStock
                      )
                    }
                  >
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    Add to Cart
                  </Button>
              
                   
                  
                </>
              )}
            </div>

            {/* Service Benefits Section */}
            <div className="mb-8 border-t border-b border-[var(--border)] py-4">
              <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)] mb-2">
                <Truck className="w-5 h-5 text-[var(--primary)]" />
                <span className="font-semibold">Complimentary Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)] mb-2">
                <RotateCcw className="w-5 h-5 text-[var(--primary)]" />
                <span className="font-semibold">Complimentary 30-Day Returns</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                <Shield className="w-5 h-5 text-[var(--primary)]" />
                <span className="font-semibold">Complimentary Gift Packaging</span>
              </div>
            </div>

            {/* Accordion Sections for Details, Description, etc. */}
            {/* <AccordionSection title="Details">
              <p className="text-[var(--foreground)] text-base leading-relaxed">
                Crafted from the finest {productDetails?.material || "Sterling Silver"} with {productDetails?.gemstone || "Brilliant-Cut Diamonds"}.
                This piece is a testament to timeless design and artisanal excellence.
              </p>
            </AccordionSection> */}

            <AccordionSection title="Details">
              <p className="text-[var(--foreground)] text-base leading-relaxed">
                {productDetails?.description || "A captivating piece designed to elevate any ensemble. Experience unparalleled brilliance and sophisticated craftsmanship."}
              </p>
            </AccordionSection>

            {productDetails?.youtubeLink && (
              <AccordionSection title="Product Video">
                <div className="py-2">
                  <YoutubeEmbed
                    url={productDetails.youtubeLink}
                    title={`${productDetails?.title} - Product Video`}
                  />
                </div>
              </AccordionSection>
            )}

            <AccordionSection title="Care & Maintenance">
              <p className="text-[var(--foreground)] text-base leading-relaxed">
                To maintain the pristine condition of your jewelry, gently clean with a soft cloth. Avoid harsh chemicals and store in a dry, cool place. Professional cleaning is recommended annually.
              </p>
            </AccordionSection>

            <AccordionSection title="Shipping & Returns">
              <p className="text-[var(--foreground)] text-base leading-relaxed mb-4">
                Enjoy complimentary express shipping on all orders. Returns are accepted within 30 days of purchase, provided the item is in its original condition with all tags intact.
              </p>
              <Button
                variant="outline"
                className="w-full text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] rounded-full font-semibold py-3"
                onClick={handlePolicyClick}
              >
                View Full Policies
              </Button>
            </AccordionSection>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;