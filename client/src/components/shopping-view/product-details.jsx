import { X, ShoppingCart, Truck, Shield, RotateCcw, Heart, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription,DialogClose } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems, updateCartQuantity, deleteCartItem } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import YoutubeEmbed from "../common/YoutubeEmbed";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatPriceWithTax } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// --- START: ProductImagesCarousel Component ---
function ProductImagesCarousel({ images, title, newArrival = false }) {
  const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);
  const mainImageRef = useRef(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!images || images.length <= 1 || isZooming) return;
    const interval = setInterval(() => {
      setCurrentMainImageIndex(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images, isZooming]);

  const handleThumbnailClick = (index) => {
    setCurrentMainImageIndex(index);
    if (thumbnailContainerRef.current) {
      const selectedThumbnail = thumbnailContainerRef.current.children[index];
      if (selectedThumbnail) {
        selectedThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const magnifierSize = 150;
  const zoomLevel = 2.5;

  const handleMouseMove = (e) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lensX = Math.min(Math.max(x - magnifierSize / 2, 0), rect.width - magnifierSize);
    const lensY = Math.min(Math.max(y - magnifierSize / 2, 0), rect.height - magnifierSize);
    const bgX = (x * zoomLevel) - (magnifierSize / 2);
    const bgY = (y * zoomLevel) - (magnifierSize / 2);
    setZoomPosition({ lensX, lensY, bgX, bgY, width: rect.width, height: rect.height });
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      <div
        ref={mainImageRef}
        className="relative overflow-hidden rounded-xl aspect-square w-full mb-2"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        style={{ cursor: 'crosshair' }}
      >
        <img
          src={images[currentMainImageIndex]}
          alt={title}
          className="w-full h-full object-cover rounded-xl transition-opacity duration-500"
        />
        {isZooming && (
          <div
            className="hidden md:block pointer-events-none rounded-full"
            style={{
              position: 'absolute',
              left: `${zoomPosition.lensX}px`,
              top: `${zoomPosition.lensY}px`,
              width: `${magnifierSize}px`,
              height: `${magnifierSize}px`,
              boxShadow: '0 5px 20px rgba(0,0,0,0.25)',
              border: '3px solid white',
              background: `url('${images[currentMainImageIndex]}') no-repeat`,
              backgroundSize: `${zoomPosition.width * zoomLevel}px ${zoomPosition.height * zoomLevel}px`,
              backgroundPosition: `-${zoomPosition.bgX}px -${zoomPosition.bgY}px`,
              zIndex: 20,
            }}
          />
        )}
      </div>
      {images.length > 1 && (
        <div
          ref={thumbnailContainerRef}
          className="flex flex-row gap-2 overflow-x-auto w-full scrollbar-hide"
        >
          {images.map((imgSrc, index) => (
            <button
              key={index}
              className={`w-16 h-16 flex-shrink-0 border-2 rounded-md overflow-hidden transition-all duration-300 ${
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
// --- END: ProductImagesCarousel Component ---

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
        <DialogContent className="p-0 flex flex-col bg-white overflow-hidden w-full max-w-none h-[100dvh] rounded-none border-none sm:max-w-4xl sm:h-auto sm:max-h-[90vh] sm:rounded-lg sm:border">
          
          {/* --- ACCESSIBILITY FIX --- */}
          {/* Added DialogTitle and DialogDescription wrapped in VisuallyHidden to fix the accessibility warning. */}
          <VisuallyHidden>
            <DialogTitle>{productDetails?.title || "Product Details"}</DialogTitle>
            <DialogDescription>
              Detailed information for {productDetails?.title || "the selected product"}. Includes images, price, and purchase options.
            </DialogDescription>
          </VisuallyHidden>
          {/* --- END FIX --- */}
    
          <div className="flex-1 flex flex-col lg:flex-row w-full overflow-y-auto">
            <div className="w-full lg:w-1/2 px-4 pb-4 sm:p-6 ">
              <ProductImagesCarousel 
                images={productDetails?.images || [productDetails?.image]} 
                title={productDetails?.title} 
              />
            </div>
            <div className="w-full lg:w-1/2 px-4 pb-6 sm:p-6 flex flex-col overflow-y-auto max-h-[60vh] lg:max-h-none">
              <div className="mb-1 sm:mb-2">
                <p className="text-[var(--muted-foreground)] uppercase text-xs sm:text-sm tracking-wide font-medium">
                  {productDetails?.collection || "Signature Collection"}
                </p>
                {productDetails?.category && (
                  <p className="text-[var(--muted-foreground)] text-xs sm:text-sm">
                    {productDetails.category}
                  </p>
                )}
              </div>
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-3 sm:mb-4 leading-tight">
                {productDetails?.title}
              </h1>
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  {productDetails?.salePrice > 0 ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-[var(--primary)]">
                          ₹{formatPriceWithTax(productDetails?.salePrice).displayPrice}
                        </span>
                        <span className="text-lg sm:text-xl text-[var(--muted-foreground)] line-through">
                          ₹{formatPriceWithTax(productDetails?.price).displayPrice}
                        </span>
                      </div>
                      <span className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-2 py-0.5 text-xs sm:text-sm rounded-full font-bold">
                        {Math.round(((productDetails?.price - productDetails?.salePrice) / productDetails?.price) * 100)}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-[var(--primary)]">
                      ₹{formatPriceWithTax(productDetails?.price).displayPrice}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Inclusive of taxes
                  </p>
                  {productDetails?.salePrice > 0 && (
                    <p className="text-xs sm:text-sm">
                      <span className="text-[var(--muted-foreground)]">You save: </span>
                      <span className="font-bold text-red-600">
                        ₹{(productDetails?.price - productDetails?.salePrice).toFixed(2)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                {productDetails?.totalStock === 0 ? (
                  <Button 
                    className="w-full h-10 text-sm rounded-lg" 
                    variant="secondary"
                    disabled
                  >
                    Out of Stock
                  </Button>
                ) : cartItem ? (
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center border rounded-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                        disabled={cartItem.quantity === 1}
                        onClick={() => handleUpdateQuantity("minus")}
                      >
                        -
                      </Button>
                      <span className="font-semibold text-base w-6 text-center">
                        {cartItem.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                        disabled={cartItem.quantity >= productDetails.totalStock}
                        onClick={() => handleUpdateQuantity("plus")}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 text-red-600 hover:bg-red-100"
                      onClick={handleRemoveFromCart}
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full h-10 text-sm rounded-lg"
                    onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </div>
              <div className="mb-6 py-4 border-t border-b border-[var(--border)] space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                  <span className="text-sm sm:text-base">Complimentary Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                  <span className="text-sm sm:text-base">7-Days Returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                  <span className="text-sm sm:text-base">Gift Packaging</span>
                </div>
              </div>
              <div className="space-y-2">
                <AccordionSection title="Product Details">
                  <ul className="space-y-2 text-sm sm:text-base">
                    {productDetails?.details?.material && (
                      <li>
                        <strong>Material:</strong>
                        <span className="ml-2">{productDetails.details.material}</span>
                      </li>
                    )}
                    {productDetails?.details?.design && (
                      <li>
                        <strong>Design:</strong>
                        <span className="ml-2">{productDetails.details.design}</span>
                      </li>
                    )}
                    {productDetails?.details?.motif && (
                      <li>
                        <strong>Motif:</strong>
                        <span className="ml-2">{productDetails.details.motif}</span>
                      </li>
                    )}
                    {productDetails?.details?.craftsmanship && (
                      <li>
                        <strong>Craftsmanship:</strong>
                        <span className="ml-2">{productDetails.details.craftsmanship}</span>
                      </li>
                    )}
                    {productDetails?.details?.wearability && (
                      <li>
                        <strong>Wearability:</strong>
                        <span className="ml-2">{productDetails.details.wearability}</span>
                      </li>
                    )}
                  </ul>
                </AccordionSection>
                {productDetails?.youtubeLink && (
                  <AccordionSection title="Video">
                    <div className="py-2">
                      <YoutubeEmbed
                        url={productDetails.youtubeLink}
                        title={productDetails?.title}
                      />
                    </div>
                  </AccordionSection>
                )}
                <AccordionSection title="Care Instructions">
                  <p className="text-sm sm:text-base leading-relaxed">
                    To maintain the beauty and longevity of your jewellery:
                    <br /><br />
                    • Gently clean with a soft, dry cloth after each use to remove oils and dust.<br />
                    • Avoid contact with water, perfumes, lotions, and harsh chemicals.<br />
                    • Do not wear while bathing, swimming, or during strenuous activities.<br />
                    • Store each piece separately in a soft pouch or jewellery box to prevent scratches and tangling.<br />
                    • Keep away from direct sunlight and extreme temperatures.
                    <br /><br />
                    With proper care, your jewellery will retain its shine and elegance for years to come.
                  </p>
                </AccordionSection>
                <AccordionSection title="Shipping & Returns">
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base leading-relaxed">
                      Free shipping on all orders. Easy 7-day returns.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full mt-2 text-sm sm:text-base"
                      onClick={handlePolicyClick}
                    >
                      View Full Policies
                    </Button>
                  </div>
                </AccordionSection>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}

export default ProductDetailsDialog;
