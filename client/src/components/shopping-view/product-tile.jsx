import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCartQuantity, deleteCartItem } from "@/store/shop/cart-slice";
import { useNavigate }  from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { formatPriceWithTax } from "@/lib/utils";


function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  // Carousel state for multiple images
  const images =
    product?.images && product.images.length > 0
      ? product.images
      : [product?.image];
  const [currentImage, setCurrentImage] = useState(0);
  const intervalRef = useRef();

  // Effect for auto-advancing image carousel
  useEffect(() => {
    if (!images || images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [images]);

  // Redux state and hooks
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Find if the current product is already in the user's cart
  const cartItem = cartItems?.items?.find((item) => item.productId === product._id);

  // Handler for updating product quantity in cart
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
      productId: product._id,
      quantity: newQty,
    }));
  }

  // Handler for removing item from cart
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
    dispatch(deleteCartItem({ userId: user?.id, productId: product._id }));
  }

  // Handler for adding product to cart
  function handleAddToCartClick() {
    if (!user) {
      toast({
        title: "Please login to add items to cart",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }
    handleAddtoCart(product?._id, product?.totalStock);
  }

  return (
    <Card className="w-full max-w-sm mx-auto h-full flex flex-col bg-[var(--card)] border border-[var(--border)] shadow-lg rounded-2xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl"> {/* Added max-w-sm */}
      {/* Clickable area for product details */}
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="flex-grow cursor-pointer"
      >
        {/* IMAGE SECTION: Portrait aspect ratio (2:3), image covers completely */}
        <div className="relative w-full aspect-[2/3] overflow-hidden rounded-t-2xl">
          <img
            src={images[currentImage]}
            alt={product?.title}
            className="w-full h-full object-cover mx-auto drop-shadow-lg"
          />
          {/* Sale badge: Prominent, distinct color (secondary/gold), z-index ensures visibility */}
          {product?.salePrice > 0 && (
            <span className="absolute top-3 right-3 bg-[var(--secondary)] text-[var(--secondary-foreground)] text-xs font-semibold px-2 py-0.5 rounded shadow z-10"> {/* Reduced padding, top/right for smaller card */}
              Sale
            </span>
          )}
          {/* Out of stock badge: Distinct from Sale, z-index ensures visibility */}
          {product?.totalStock === 0 && (
            <span className="absolute top-3 left-3 bg-[var(--destructive)] text-[var(--destructive-foreground)] text-xs font-semibold px-2 py-0.5 rounded shadow z-10"> {/* Reduced padding, top/left for smaller card */}
              Out Of Stock
            </span>
          )}
        </div>

        {/* PRODUCT DETAILS SECTION: Mixed alignment for elegance and clarity */}
        <CardContent className="pt-4 pb-2 px-4 flex flex-col items-start"> {/* Reduced padding */}
          {/* Title: Left-aligned for optimal readability, bold, and multi-line support */}
          <h2 className="text-base md:text-lg font-serif font-bold text-[var(--foreground)] mb-1 line-clamp-2 tracking-tight w-full leading-snug"> {/* Slightly reduced font, mb */}
            {product?.title}
          </h2>

          {/* Category/Subcategory: Aligned left and right (space-between) for clean separation */}
          <div className="flex items-center justify-between w-full mb-2"> {/* Reduced mb */}
            <span className="text-xs text-[var(--muted-foreground)] font-medium"> {/* Slightly reduced font */}
              {product?.category}
            </span>
            {product?.subcategory && (
                <span className="text-xs text-[var(--muted-foreground)] font-medium"> {/* Slightly reduced font */}
                    {product?.subcategory}
                </span>
            )}
          </div>

          {/* Price: Perfectly Centered and prominent */}
          <div className="flex items-baseline gap-2 mb-3 mx-auto"> {/* Reduced gap, mb */}
            {product?.salePrice > 0 ? (
              <>
                <span className="text-sm font-semibold text-[var(--muted-foreground)] line-through"> {/* Reduced font */}
                ₹{formatPriceWithTax(product?.price).displayPrice}

                </span>
                <span className="text-lg font-bold text-[var(--primary)]"> {/* Reduced font */}
                ₹{formatPriceWithTax(product?.salePrice).displayPrice}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-[var(--primary)]"> {/* Reduced font */}
                ₹{formatPriceWithTax(product?.price).displayPrice}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
                Inclusive of taxes
              </span>
          </div>
        </CardContent>
      </div>

      {/* CARD FOOTER / ACTIONS SECTION: Centered for a balanced look */}
      <CardFooter className="pb-4 px-4 flex justify-center w-full"> {/* Reduced padding */}
        {product?.totalStock === 0 ? (
          <Button className="w-full text-xs opacity-60 cursor-not-allowed bg-[var(--muted)] text-[var(--muted-foreground)] py-1.5" disabled> {/* Reduced py */}
            Out Of Stock
          </Button>
        ) : cartItem ? (
          <div className="flex items-center w-full gap-1 justify-center"> {/* Reduced gap */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] rounded-full" 
              disabled={cartItem.quantity === 1}
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateQuantity("minus");
              }}
            >
              -
            </Button>
            <span className="font-semibold text-sm w-6 text-center text-[var(--foreground)]"> {/* Reduced font, width */}
              {cartItem.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] rounded-full" 
              disabled={cartItem.quantity >= product.totalStock}
              onClick={(e) => {
                  e.stopPropagation();
                handleUpdateQuantity("plus");
              }}
            >
              +
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-[var(--destructive-foreground)] rounded-full" 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromCart();
              }}
            >
              x
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAddToCartClick}
            className="w-full text-xs py-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold rounded-full shadow hover:bg-[var(--accent)] transition-colors duration-200" 
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;