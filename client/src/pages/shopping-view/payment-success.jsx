import { CheckCircle2, Download } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { downloadInvoice } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

// --- NO LOGIC IS CHANGED ---
export default function PaymentSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [latestOrderId, setLatestOrderId] = useState(null);

  useEffect(() => {
    const orderId = localStorage.getItem('latestOrderId') || new URLSearchParams(window.location.search).get('orderId');
    if (orderId) {
      setLatestOrderId(orderId);
      // It's good practice to clear the item from localStorage after use
      localStorage.removeItem('latestOrderId');
    }
  }, []);

  const handleDownloadInvoice = () => {
    if (latestOrderId && user?.id) {
      dispatch(downloadInvoice({ orderId: latestOrderId, userId: user.id }));
      toast({
        title: "Invoice Download Initiated",
        description: "Your invoice should be available in your downloads folder shortly.",
      });
    } else {
      toast({
        title: "Unable to find Order ID",
        description: "Please visit 'My Orders' to download your invoice.",
        variant: "destructive",
      });
    }
  };

  // --- UI REDESIGNED FOR A LUXURY AESTHETIC ---
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl bg-white text-center p-8 sm:p-12 lg:p-16 shadow-lg rounded-lg">
        {/* The icon is styled to be sophisticated, not loud. */}
        <CheckCircle2 className="text-gray-800 mx-auto mb-6" size={60} strokeWidth={1.5} />

        {/* The heading uses a serif font for an elegant, classic feel. */}
        <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
          Your Order is Confirmed
        </h1>

        {/* The message is personalized and reassuring. */}
        <p className="text-gray-600 mb-8 text-base max-w-lg mx-auto">
          Thank you for your acquisition, {user?.name ? `${user.name}` : 'customer'}. We are preparing your items with the utmost care. 
          A confirmation has been sent to your registered email.
        </p>

        {/* A subtle divider creates a structured separation before the actions. */}
        <div className="border-t border-gray-200 my-8"></div>
        
        <p className="text-sm text-gray-500 mb-6">What would you like to do next?</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* The primary button is strong, dark, and confident. */}
          <Button
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-md uppercase tracking-wider transition-colors duration-300"
            onClick={() => navigate("/shop/account")}
          >
            My Orders
          </Button>
          
          {/* The secondary button is a refined, non-intrusive outline style. */}
          {latestOrderId && (
            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2 border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold px-8 py-3 rounded-md uppercase tracking-wider transition-colors duration-300"
              onClick={handleDownloadInvoice}
            >
              <Download className="h-4 w-4" />
              Invoice
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}