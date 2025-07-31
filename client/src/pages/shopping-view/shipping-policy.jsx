import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ShippingPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content below navbar */}
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policy</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-8">
              We aim to provide reliable and timely delivery. Please review our shipping timelines and restrictions before placing your order.
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Timeline</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Order Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Processing Time</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Shipping Time</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Estimated Delivery Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Domestic (India)</td>
                      <td className="border border-gray-300 px-4 py-2">1-2 business days</td>
                      <td className="border border-gray-300 px-4 py-2">2-7 business days*</td>
                      <td className="border border-gray-300 px-4 py-2">3-9 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">International</td>
                      <td className="border border-gray-300 px-4 py-2">2-4 business days</td>
                      <td className="border border-gray-300 px-4 py-2">7-21 business days*</td>
                      <td className="border border-gray-300 px-4 py-2">9-25 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-blue-800">
                    <strong>*Minimum delivery:</strong> Orders may arrive as early as 3 business days within India, depending on your location.
                  </p>
                </div>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <p className="text-orange-800">
                    <strong>*Maximum delivery:</strong> Domestic orders are expected within 9 days; international orders within 25 days.
                  </p>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> Shipping delays due to customs, holidays, natural disasters, or other uncontrollable factors are possible.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-800 font-medium">
                  We do not ship to P.O. boxes.
                </p>
              </div>
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                <p className="text-gray-800">
                  Please ensure your shipping address is accurate; we are not responsible for delays due to incorrect information.
                </p>
              </div>
            </section>

            <div className="mt-12 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Contact Information:</strong><br />
                For shipping-related questions, please contact us at:<br />
                Email: pradhikshaasilks@gmail.com<br />
                Phone: +91 99948 19203
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingPolicy; 