import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCartQuantity, deleteCartItem } from "@/store/shop/cart-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { formatPriceWithTax } from "@/lib/utils";
import { X } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const images = product?.images?.length > 0 ? product.images : [product?.image];
  const [currentImage, setCurrentImage] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    if (!images || images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [images]);

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const cartItem = cartItems?.items?.find((item) => item.productId === product._id);

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
    <Card className="w-full max-w-sm mx-auto h-full flex flex-col bg-background border border-border shadow-sm rounded-xl transition-all duration-300 hover:shadow-md group overflow-hidden">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="flex-grow cursor-pointer flex flex-col"
      >
        {/* Image Container */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-xl">
          <img
            src={images[currentImage]}
            alt={product?.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            {product?.totalStock === 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                Out Of Stock
              </span>
            )}
            {product?.totalStock > 0 && product?.salePrice > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="pt-4 pb-2 px-4 space-y-3 flex-grow flex flex-col justify-between">
          {/* Title and Categories */}
          <div className="space-y-2">
            <h2 className="text-base font-medium text-foreground line-clamp-2 leading-tight">
              {product?.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {product?.category && (
                <span className="capitalize border-b border-muted-foreground/30 pb-0.5">
                  {product.category}
                </span>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-3 space-y-1">
            {/* MODIFIED: Added flex-wrap to allow prices to wrap on smaller screens */}
            <div className="flex flex-wrap items-baseline gap-x-2">
              {product?.salePrice > 0 ? (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{formatPriceWithTax(product?.price).displayPrice}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ₹{formatPriceWithTax(product?.salePrice).displayPrice}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-foreground">
                  ₹{formatPriceWithTax(product?.price).displayPrice}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
          </div>
        </CardContent>
      </div>

      {/* Action Buttons */}
      <CardFooter className="px-4 pb-4 flex-shrink-0">
        {product?.totalStock === 0 ? (
          <Button 
            variant="ghost"
            className="w-full text-sm rounded-lg py-2.5 bg-muted text-muted-foreground" 
            disabled
          >
            Out Of Stock
          </Button>
        ) : cartItem ? (
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center border rounded-full">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-foreground hover:bg-muted" 
                disabled={cartItem.quantity === 1}
                onClick={(e) => { e.stopPropagation(); handleUpdateQuantity("minus"); }}
              >
                -
              </Button>
              <span className="font-medium text-sm w-6 text-center text-foreground">
                {cartItem.quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-foreground hover:bg-muted" 
                disabled={cartItem.quantity >= product.totalStock}
                onClick={(e) => { e.stopPropagation(); handleUpdateQuantity("plus"); }}
              >
                +
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" 
              onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(); }}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <Button
            onClick={(e) => { e.stopPropagation(); handleAddToCartClick(); }}
            className="w-full text-sm py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg" 
          >
            Add to Bag
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;