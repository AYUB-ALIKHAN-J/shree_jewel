import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
  downloadInvoice,
} from "@/store/shop/order-slice";
import { Download, Eye } from "lucide-react";
import { useToast } from "../ui/use-toast";

const OrderStatusBadge = ({ status }) => {
  const statusStyles = {
    pending: "bg-amber-500",
    confirmed: "bg-green-500",
    delivered: "bg-blue-500",
    rejected: "bg-red-500",
  };
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${statusStyles[status.toLowerCase()] || 'bg-gray-500'}`} />
      <span className="capitalize">{status}</span>
    </div>
  );
};

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  const { toast } = useToast();

  const handleViewOrderDetails = (orderId) => {
    setSelectedOrderId(orderId);
    dispatch(getOrderDetails(orderId));
    setOpenDetailsDialog(true);
  };

  const handleDownloadInvoice = async (orderId) => {
    if (orderId && user?.id) {
      setDownloadingInvoice(orderId);
      try {
        await dispatch(downloadInvoice({ orderId, userId: user.id })).unwrap();
        toast({
          title: "Invoice downloaded successfully",
          description: `Invoice for order ID ${orderId.slice(-8)} downloaded.`,
        });
      } catch (error) {
        console.error('Download failed:', error);
        toast({
          title: "Error downloading invoice",
          description: "Failed to download invoice. Please try again.",
          variant: "destructive",
        });
      } finally {
        setDownloadingInvoice(null);
      }
    } else {
      toast({
        title: "Error downloading invoice",
        description: "Order ID or user ID not available.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
        dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (orderDetails !== null) {
        setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  return (
    <div className="bg-white p-6 lg:p-8 rounded-lg border border-gray-200/80 shadow-sm">
      <h3 className="text-2xl font-serif text-gray-900 mb-8">Order History</h3>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-gray-200/80">
            <TableHead className="text-gray-500 uppercase tracking-wider">Order</TableHead>
            <TableHead className="text-gray-500 uppercase tracking-wider">Date</TableHead>
            <TableHead className="text-gray-500 uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-right text-gray-500 uppercase tracking-wider">Total</TableHead>
            <TableHead className="text-right text-gray-500 uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList && orderList.length > 0 ? (
            orderList.slice().reverse().map((orderItem) => (
              <TableRow 
                key={orderItem?._id} 
                className="border-b-gray-200/50 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewOrderDetails(orderItem?._id)}
              >
                <TableCell className="py-4 font-mono text-gray-600 text-sm">#{orderItem?._id.slice(-8)}</TableCell>
                <TableCell className="py-4">{new Date(orderItem?.orderDate).toLocaleDateString()}</TableCell>
                <TableCell className="py-4"><OrderStatusBadge status={orderItem?.orderStatus} /></TableCell>
                <TableCell className="py-4 text-right font-medium">₹{orderItem?.totalAmount.toFixed(2)}</TableCell>
                <TableCell className="py-4">
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrderDetails(orderItem?._id);
                      }}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadInvoice(orderItem?._id);
                      }}
                      disabled={downloadingInvoice === orderItem?._id}
                    >
                      {downloadingInvoice === orderItem?._id ? (
                        <div className="h-4 w-4 border-2 border-dashed rounded-full animate-spin border-gray-600"></div>
                      ) : (
                        <Download className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="5" className="text-center py-16 text-gray-500">
                You have not placed any orders yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Order Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDetailsDialog(false);
            dispatch(resetOrderDetails());
          }
        }}
      >
        <ShoppingOrderDetailsView 
          orderDetails={orderDetails} 
          onClose={() => {
            setOpenDetailsDialog(false);
            dispatch(resetOrderDetails());
          }}
        />
      </Dialog>
    </div>
  );
}

export default ShoppingOrders;