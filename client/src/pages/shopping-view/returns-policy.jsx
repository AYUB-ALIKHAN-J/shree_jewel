import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ReturnsPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content below navbar */}
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Returns, Exchange & Cancellation Policy</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Return Policy</h2>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Domestic Orders (Within India)</h3>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-800 font-medium">Important: Sale/Deal items are not eligible for return or exchange.</p>
              </div>

              <h4 className="text-md font-semibold text-gray-700 mb-2">Eligibility:</h4>
              <p className="text-gray-700 mb-4">
                Returns are accepted only if notified within 24 hours of delivery for:
              </p>
              
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Damaged or defective items</li>
                <li>Incorrect item delivered</li>
              </ul>

              <h4 className="text-md font-semibold text-gray-700 mb-3">Return Process</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">1</div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Notify Within 24 Hours</h5>
                    <p className="text-gray-700 text-sm">Contact via email or WhatsApp with order details and reason</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">2</div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Provide Proof</h5>
                    <p className="text-gray-700 text-sm">Unedited unboxing video showing product, tags, and packaging</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">3</div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Await Approval</h5>
                    <p className="text-gray-700 text-sm">Our team will review and approve your return request</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">4</div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-1">Ship Within 3 Days</h5>
                    <p className="text-gray-700 text-sm">Pack securely and ship to provided address</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Exchange Policy</h2>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Eligibility</h4>
              <p className="text-gray-700 mb-4">
                Only for defective/damaged items within 24 hours
              </p>
              
              <h4 className="text-md font-semibold text-gray-700 mb-2">Requirements</h4>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Unboxing video</li>
                <li>Original tags</li>
                <li>Unused condition</li>
              </ul>
              
              <h4 className="text-md font-semibold text-gray-700 mb-2">Process</h4>
              <p className="text-gray-700 mb-4">
                Same as return procedure, customer pays shipping
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancellation Policy</h2>
              <div className="space-y-3">
                <div className="bg-green-50 border-l-4 border-green-400 p-3">
                  <p className="text-green-800"><strong>Before Shipping:</strong> Full cancellation allowed</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-3">
                  <p className="text-red-800"><strong>After Shipping:</strong> Cancellation not permitted</p>
                </div>
              </div>
              <p className="text-gray-700 mt-4">
                Contact immediately: <strong>+91 99948 19203</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quality Check Criteria</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>No signs of use, wash, or alteration</li>
                <li>All original tags intact</li>
                <li>Original folding and packaging</li>
                <li>Free from stains, odors, or damage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Notes</h2>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Refund Options</h4>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Product exchange</li>
                <li>Gift card equivalent</li>
                <li>Full refund (if out of stock)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">International Orders</h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-800 font-medium">
                  Returns and exchanges not accepted for orders shipped outside India.
                </p>
              </div>
            </section>

            <div className="mt-12 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Contact Information:</strong><br />
                For any questions about our Returns, Exchange & Cancellation Policy, please contact us at:<br />
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

export default ReturnsPolicy; 