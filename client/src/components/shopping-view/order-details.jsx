import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle,DialogClose } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Download ,X} from "lucide-react";
import { getTaxDisplayText } from "@/lib/utils";
import { downloadInvoice } from "@/store/shop/order-slice";
import { useToast } from "../ui/use-toast";

const statusTitles = {
  pending: "Order Pending",
  confirmed: "Order Confirmed",
  delivered: "Order Delivered",
  rejected: "Order Rejected",
  cancelled: "Order Cancelled",
  processing: "Processing Your Order",
  shipped: "Order Shipped"
};
const formatPrice = (value) => {
  const num = Number(value);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  const PLACEHOLDER = "https://via.placeholder.com/80x100?text=No+Image";
  const [productImages, setProductImages] = useState({});
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchImages() {
      if (!orderDetails?.cartItems) return;
      const promises = orderDetails.cartItems.map(async (item) => {
        if (!item.productId) return [item.productId, PLACEHOLDER];
        try {
          const res = await axios.get(`/api/shop/products/get/${item.productId}`);
          return [item.productId, res.data?.data?.images?.[0] || PLACEHOLDER];
        } catch {
          return [item.productId, PLACEHOLDER];
        }
      });
      const results = await Promise.all(promises);
      const imagesMap = Object.fromEntries(results);
      setProductImages(imagesMap);
    }
    fetchImages();
  }, [orderDetails]);

  const handleDownloadInvoice = () => {
    if (orderDetails?._id && user?.id) {
      dispatch(downloadInvoice({ orderId: orderDetails._id, userId: user.id }));
      toast({
        title: "Invoice downloaded successfully",
        description: `Invoice for order ID ${orderDetails._id} downloaded.`,
      });
    } else {
      toast({
        title: "Error downloading invoice",
        description: "Order ID or user ID not available.",
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent className="p-0 border-0 flex flex-col h-full pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:h-auto sm:rounded-lg sm:max-h-[90vh] sm:max-w-[700px] overflow-hidden">
      {/* Fixed Header Section */}
      <div className="relative bg-gradient-to-r from-[#111827] to-[#1f2937] text-white p-6 md:p-6 sticky top-0 z-10">
        <DialogTitle className="text-2xl font-serif tracking-wide">
          {statusTitles[orderDetails?.orderStatus?.toLowerCase()] || "Order Details"}
        </DialogTitle>
        <p className="text-sm text-gray-300 mt-1">
          Order #{orderDetails?._id?.slice(-8) || '--------'}
        </p>

        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            className="absolute top-4 right-4 rounded-full w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogClose>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24 md:pb-6">
        {/* Order Items Section */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h3 className="font-serif text-xl font-medium mb-6 text-gray-900">
            Your Items
          </h3>
          <div className="space-y-6">
            {orderDetails?.cartItems?.length > 0 ? (
              orderDetails.cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 border-b border-gray-100 last:border-0">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={productImages[item.productId] || PLACEHOLDER}
                      alt={item.title || "Product"}
                      className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-md border border-gray-200"
                      onError={e => e.target.src = PLACEHOLDER}
                    />
                    <div className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-2">
                      {item.title || "Product Title Not Available"}
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Unit Price</p>
                        <p className="font-medium">₹{formatPrice(item.price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-bold text-emerald-600">
                          ₹{formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No items found in this order
              </div>
            )}
          </div>
        </div>

        {/* Price Breakdown Section */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h3 className="font-serif text-xl font-medium mb-6 text-gray-900">
            Price Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                ₹{formatPrice(orderDetails?.subtotal || orderDetails?.totalAmount)}
              </span>
            </div>
            {orderDetails?.taxAmount && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {getTaxDisplayText(orderDetails?.addressInfo?.state)}
                </span>
                <span className="font-medium">₹{formatPrice(orderDetails?.taxAmount)}</span>
              </div>
            )}
            {orderDetails?.shippingCharges && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  ₹{formatPrice(orderDetails?.shippingCharges)}
                </span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-emerald-600">
                ₹{formatPrice(orderDetails?.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information Section */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h3 className="font-serif text-xl font-medium mb-6 text-gray-900">
            Shipping Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Recipient</p>
              <p className="font-medium">{user?.userName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">
                {orderDetails?.addressInfo?.address}
              </p>
              <p className="text-gray-600">
                {orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.state},{" "}
                {orderDetails?.addressInfo?.country} - {orderDetails?.addressInfo?.pincode}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{orderDetails?.addressInfo?.phone}</p>
            </div>
            {orderDetails?.addressInfo?.notes && (
              <div>
                <p className="text-sm text-gray-500">Special Instructions</p>
                <p className="italic text-gray-600">
                  {orderDetails?.addressInfo?.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer Section for Download Button */}
      <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0 z-10">
          <Button
            onClick={handleDownloadInvoice}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Invoice
          </Button>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;