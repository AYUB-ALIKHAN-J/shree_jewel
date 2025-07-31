import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder, captureRazorpayPayment } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  calculatePriceWithTax, 
  calculateTaxAmount, 
  calculateTotalWithTaxAndShipping,
  calculateShippingCharges,
  getTaxDisplayText
} from "@/lib/utils";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

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

  // Calculate price breakdown
  const subtotal = totalCartAmount;
  const taxAmount = calculateTaxAmount(subtotal);
  const shippingCharges = calculateShippingCharges(currentSelectedAddress?.country);
  const totalAmount = calculateTotalWithTaxAndShipping(subtotal, currentSelectedAddress?.country);

  function handleInitiateRazorpayPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
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
          key: "rzp_test_yfhK4vRHVaf2IB", // Your Razorpay Test Key
          amount: data.payload.razorpayOrder.amount,
          currency: data.payload.razorpayOrder.currency,
          name: "Pradhikshaa Silks",
          description: "Order Payment",
          order_id: data.payload.razorpayOrder.id,
          handler: function (response) {
            // After payment, redirect to success page. Order/cart will be updated by webhook.
            // Store order ID for invoice download
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
            color: "#F37254",
          },
          method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} alt="Account" className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Please select an address to proceed</h3>
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        </div>
        <div className="flex flex-col gap-4">
          {cartItems?.items?.length > 0
            ? cartItems.items.map((item, idx) => (
                <UserCartItemsContent cartItem={item} key={item.productId || idx} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{getTaxDisplayText(currentSelectedAddress?.state)}</span>
                <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping Charges</span>
                <span className="font-medium">
                  {shippingCharges === null ? "To be calculated" : `₹${shippingCharges.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {totalAmount === null ? "To be calculated" : `₹${totalAmount.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of taxes</p>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button 
              onClick={handleInitiateRazorpayPayment} 
              className="w-full"
              disabled={totalAmount === null}
            >
              {isPaymentStart
                ? "Processing Razorpay Payment..."
                : "Checkout with Razorpay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
