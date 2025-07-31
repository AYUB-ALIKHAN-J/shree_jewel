import { CheckCircle2, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { downloadInvoice } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [latestOrderId, setLatestOrderId] = useState(null);

  useEffect(() => {
    // Get the latest order ID from localStorage or URL params
    const orderId = localStorage.getItem('latestOrderId') || new URLSearchParams(window.location.search).get('orderId');
    if (orderId) {
      setLatestOrderId(orderId);
    }
  }, []);

  const handleDownloadInvoice = () => {
    if (latestOrderId && user?.id) {
      dispatch(downloadInvoice({ orderId: latestOrderId, userId: user.id }));
      toast({
        title: "Invoice downloaded successfully",
        description: "Your invoice has been downloaded.",
      });
    } else {
      toast({
        title: "Invoice not available",
        description: "Please check your orders page to download the invoice.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white px-4 py-12">
      <CheckCircle2 className="text-green-500 mb-4" size={72} />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Thank you for your purchase.<br />
        Your order has been placed successfully.
      </p>
      <div className="flex gap-4">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
          onClick={() => navigate("/shop/account")}
        >
          View My Orders
        </Button>
        {latestOrderId && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleDownloadInvoice}
          >
            <Download className="h-4 w-4" />
            Download Invoice
          </Button>
        )}
      </div>
    </div>
  );
}
