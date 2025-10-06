import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg"; // Recommended: Use a high-end, atmospheric banner image
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  calculateTaxAmount, 
  calculateTotalWithTaxAndShipping,
  calculateShippingCharges,
  getTaxDisplayText
} from "@/lib/utils";

// --- NO LOGIC IS CHANGED ---
function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const subtotal = totalCartAmount;
  // Update taxAmount calculation
  const taxAmount = currentSelectedAddress ? calculateTaxAmount(subtotal, currentSelectedAddress.country) : 0;
  const shippingCharges = calculateShippingCharges(currentSelectedAddress?.country);
  const totalAmount = calculateTotalWithTaxAndShipping(subtotal, currentSelectedAddress?.country);

  function handleInitiateRazorpayPayment() {
    if (!cartItems || cartItems.items.length === 0) {
      toast({
        title: "Your selection is empty.",
        description: "Please add a piece to your collection to proceed.",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Delivery Details Required",
        description: "Kindly select a shipping destination for your acquisition.",
        variant: "destructive",
      });
      return;
    }
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        state: currentSelectedAddress?.state,
        country: currentSelectedAddress?.country,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
        isGift: Boolean(currentSelectedAddress?.isGift),
        giftMessage: currentSelectedAddress?.giftMessage || "",
      },
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount: totalAmount,
      subtotal: subtotal,
      taxAmount: taxAmount,
      shippingCharges: shippingCharges,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success && data?.payload?.razorpayOrder) {
        const options = {
          key: "rzp_live_P2xLhx4GNQtcme", // Your Razorpay Test Key
          amount: data.payload.razorpayOrder.amount,
          currency: data.payload.razorpayOrder.currency,
          name: "Shree Jewel Palace", // Name of your luxury brand
          description: "Finalize Your Acquisition",
          order_id: data.payload.razorpayOrder.id,
          handler: function (response) {
            if (data?.payload?.orderId) {
              localStorage.setItem('latestOrderId', data.payload.orderId);
            }
            window.location.href = "/shop/payment-success";
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: currentSelectedAddress?.phone,
          },
          theme: {
            color: "#0E4F3F", // A sophisticated, dark charcoal theme
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    });
  }

  // --- UI REDESIGNED FOR A LUXURY AESTHETIC ---
  return (
    // Use a soft, off-white background for a more premium feel than stark white
    <div className="bg-stone-50 font-sans">
      <div className="relative h-56">
        <img src={img} alt="Aesthetic Banner" className="h-full w-full object-cover object-center brightness-50" />
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Serif fonts for headings evoke classic luxury */}
            <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-widest text-center uppercase">
              Finalize Your Order
            </h1>
        </div>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-x-16 relative">
          
          {/* Main Content (Scrollable) */}
          <div className="lg:col-span-3 py-12 lg:py-16">
            <h2 className="text-3xl font-serif mb-8 text-gray-900">
              Delivery Details
            </h2>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* Sticky Sidebar (Order Summary) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-10">
                <div className="bg-white rounded-none lg:rounded-lg border-y lg:border border-gray-200/80 p-6 lg:p-8 my-10 lg:my-16 shadow-sm">
                    <h2 className="text-3xl font-serif mb-8 text-gray-900">Your Selection</h2>

                    {/* Product List */}
                    <div className="max-h-[55vh] overflow-y-auto pr-3 space-y-6">
                        {cartItems?.items?.length > 0
                        ? cartItems.items.map((item, idx) => (
                            <UserCartItemsContent cartItem={item} key={item.productId || idx} />
                            ))
                        : <p className="text-gray-500">Your bag is currently empty.</p>}
                    </div>

                    {/* Price Breakdown - uses spacing instead of lines for a cleaner look */}
                    <div className="mt-10 space-y-4">
                        <div className="flex justify-between text-base">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                        </div>
                        {currentSelectedAddress && (
                          <div className="flex justify-between text-base">
                              <span className="text-gray-500">
                                {getTaxDisplayText(currentSelectedAddress?.state, currentSelectedAddress?.country)}
                              </span>
                              <span className="font-medium text-gray-900">₹{taxAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {currentSelectedAddress && (
                          currentSelectedAddress.country && currentSelectedAddress.country.toLowerCase() === 'india' ? (
                            <div className="flex flex-col">
                              <div className="flex justify-between text-base">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-medium text-gray-900">₹0</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Shipping within India is free.
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg mt-2">
                                <h4 className="font-serif font-semibold text-amber-900">A Note on International Orders</h4>
                                <div className="mt-2 text-sm text-amber-800 leading-relaxed">
                                    <p>
                                        Shipping for international orders will be arranged by us; however, all shipping charges must be paid by the buyer.
                                    </p>
                                    <p className="mt-2">
                                        Additionally, any customs duties, taxes, or import clearance fees (if applicable) are the responsibility of the recipient in the destination country.
                                    </p>
                                </div>
                            </div>
                          )
                        )}
                        <div className="pt-4 mt-2">
                            <div className="flex justify-between text-xl font-semibold text-gray-900">
                              <span>Total</span>
                              <span>
                                  {totalAmount === null ? "..." : `₹${totalAmount.toFixed(2)}`}
                              </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Checkout Button */}
                    <div className="mt-8 w-full">
                  <Button
                    onClick={handleInitiateRazorpayPayment}
                    // The hardcoded gray colors have been removed.
                    // The button now uses the theme's primary color (green) by default.
                    className="w-full font-semibold py-4 text-sm rounded-md uppercase tracking-wider transition-colors duration-300"
                    disabled={totalAmount === null}
                  >
                    {isPaymentStart
                      ? "Processing..."
                      : "Proceed to Payment"}
                  </Button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;