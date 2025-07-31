import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonForm from "../common/form";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import axios from "axios";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const PLACEHOLDER = "https://via.placeholder.com/80x100?text=No+Image";
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    async function fetchImages() {
      if (!orderDetails?.cartItems) return;
      const promises = orderDetails.cartItems.map(async (item) => {
        if (!item.productId) {
          console.warn('Missing productId for item:', item);
          return [item.productId, PLACEHOLDER];
        }
        try {
          const res = await axios.get(`/api/shop/products/get/${item.productId}`);
          console.log('Fetched product for', item.productId, res.data);
          return [item.productId, res.data?.data?.images?.[0] || PLACEHOLDER];
        } catch (err) {
          console.error('Error fetching product for', item.productId, err);
          return [item.productId, PLACEHOLDER];
        }
      });
      const results = await Promise.all(promises);
      const imagesMap = Object.fromEntries(results);
      console.log('Final productImages map:', imagesMap);
      setProductImages(imagesMap);
    }
    fetchImages();
  }, [orderDetails]);

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogTitle className="text-xl font-bold mb-4">Order Details</DialogTitle>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label className="text-xs sm:text-sm break-all">{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>₹{orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-yellow-500"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium text-lg">Order Items</div>
            <div className="grid gap-4">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 p-3 border rounded-lg bg-gray-50">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={productImages[item.productId] || PLACEHOLDER}
                          alt={item.title || "Product"}
                          className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-md border shadow-sm"
                          onError={e => {
                            if (e.target.src !== PLACEHOLDER) {
                              e.target.src = PLACEHOLDER;
                            }
                          }}
                        />
                      </div>
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="grid gap-2">
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2">
                              {item.title || "Product Title Not Available"}
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                            <div className="flex flex-col">
                              <span className="text-gray-500">Quantity</span>
                              <span className="font-medium">{item.quantity}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500">Price</span>
                              <span className="font-medium">₹{item.price}</span>
                            </div>
                            <div className="flex flex-col sm:col-span-1 col-span-2">
                              <span className="text-gray-500">Total</span>
                              <span className="font-bold text-primary">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : (
                    <div className="text-center text-gray-500 py-4">
                      No items found in this order
                    </div>
                  )}
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium text-lg">Shipping Information</div>
            <div className="grid gap-2 p-3 border rounded-lg bg-gray-50">
              <div className="grid gap-1 text-sm">
                <div className="font-medium text-gray-900">{user?.userName}</div>
                <div className="text-gray-600">{orderDetails?.addressInfo?.address}</div>
                <div className="text-gray-600">
                  {orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}
                </div>
                <div className="text-gray-600">Phone: {orderDetails?.addressInfo?.phone}</div>
                {orderDetails?.addressInfo?.notes && (
                  <div className="text-gray-600">
                    <span className="font-medium">Notes:</span> {orderDetails?.addressInfo?.notes}
                  </div>
                )}
                <div className="text-gray-600">
                  <span className="font-medium">Recipient:</span>{" "}
                  {orderDetails?.addressInfo?.isGift ? (
                    <span className="text-green-700 font-bold">Gift for someone else</span>
                  ) : (
                    <span>Customer themselves</span>
                  )}
                </div>
                {orderDetails?.addressInfo?.isGift &&
                orderDetails?.addressInfo?.giftMessage && (
                  <div className="text-gray-600">
                    <span className="font-medium">Gift Message:</span>{" "}
                    <span className="italic">"{orderDetails.addressInfo.giftMessage}"</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium text-lg">Update Order Status</div>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "delivered", label: "Delivered" },
                    { id: "rejected", label: "Rejected" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={"Update Order Status"}
              onSubmit={handleUpdateStatus}
            />
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
