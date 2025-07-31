import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
import { Badge } from "../ui/badge";
import { Download } from "lucide-react";
import { useToast } from "../ui/use-toast";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);
  const { toast } = useToast();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  const handleDownloadInvoice = async (orderId) => {
    if (orderId && user?.id) {
      setDownloadingInvoice(orderId);
      try {
        await dispatch(downloadInvoice({ orderId, userId: user.id })).unwrap();
        toast({
          title: "Invoice downloaded successfully",
          description: `Invoice for order ID ${orderId} downloaded.`,
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
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.slice().reverse().map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(orderItem?._id)}
                            className="flex items-center gap-1"
                            disabled={downloadingInvoice === orderItem?._id}
                          >
                            {downloadingInvoice === orderItem?._id ? (
                              "Downloading..."
                            ) : (
                              <>
                                <Download className="h-4 w-4" />
                                Invoice
                              </>
                            )}
                          </Button>
                        </div>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
