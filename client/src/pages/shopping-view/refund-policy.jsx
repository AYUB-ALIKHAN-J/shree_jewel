import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function RefundPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content below navbar */}
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Refund Policy</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Eligibility</h2>
              <p className="text-gray-700 mb-4">
                Refunds are granted only in the following cases:
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <ul className="list-disc pl-6 text-green-800">
                  <li>Order cancelled by the customer before shipping (refund minus 4% platform fee and GST).</li>
                  <li>Product out of stock (full refund issued).</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Deductions</h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Cancellation before shipping:</h4>
                  <p className="text-yellow-800">Refund processed minus 4% platform fee and GST.</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Out of stock:</h4>
                  <p className="text-green-800">Full refund.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Process</h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <ul className="list-disc pl-6 text-blue-800">
                  <li>Approved refunds will be processed within 3–7 business days.</li>
                  <li>Additional time may be needed by banks or payment processors.</li>
                  <li>Shipping fees are non-refundable.</li>
                </ul>
              </div>
            </section>

            <div className="mt-12 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Contact Information:</strong><br />
                For refund-related questions, please contact us at:<br />
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

export default RefundPolicy; 