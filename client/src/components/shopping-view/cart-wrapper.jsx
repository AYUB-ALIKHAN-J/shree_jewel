import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { formatPriceWithTax } from "@/lib/utils";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum + formatPriceWithTax(
              (currentItem?.salePrice > 0
                ? currentItem?.salePrice
                : currentItem?.price) *
              currentItem?.quantity
            ).priceWithTax,
          0
        )
      : 0;

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Please login to checkout",
        description: "You need to be logged in to complete your purchase",
        variant: "destructive",
      });
      navigate("/auth/login");
      setOpenCartSheet(false);
      return;
    }
    navigate("/shop/checkout");
    setOpenCartSheet(false);
  };

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item, index) => (
              <UserCartItemsContent key={item.productId || item._id || index} cartItem={item} />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Subtotal</span>
          <span className="font-bold"> ₹{totalCartAmount.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500">Shipping charges calculated at checkout</p>
      </div>
      <Button
        onClick={handleCheckout}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
)};

UserCartWrapper.propTypes = {
  cartItems: PropTypes.array.isRequired,
  setOpenCartSheet: PropTypes.func.isRequired,
};

export default UserCartWrapper;
