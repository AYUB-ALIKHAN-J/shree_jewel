import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function TermsConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content below navbar */}
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Terms and Conditions of Sale & Website Use</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Sale and Purchase</h2>
              <p className="text-gray-700 mb-4">
                By placing an order on pradhikshaasilks.com, you ("Buyer") agree to purchase products ("Goods") as described at checkout, subject to these Terms. Pradhikshaa Silks reserves the right to accept or decline any order at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Prices & Payments</h2>
              <p className="text-gray-700 mb-4">
                All prices are listed in Indian Rupees (INR) and include applicable taxes. Full payment must be made at the time of checkout. We use secure payment processing via Razorpay.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Delivery</h2>
              <p className="text-gray-700 mb-4">
                Orders are shipped in accordance with our Shipping Policy. Delivery dates are estimates and not guaranteed. Pradhikshaa Silks is not liable for delivery delays beyond our control—including customs, holidays, or unforeseen events.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Customs, Duties & Taxes</h2>
              <p className="text-gray-700 mb-4">
                International recipients are responsible for any import duties, taxes, or customs fees. These charges are not included in your purchase price and must be paid by the recipient.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Product Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                Colors may appear slightly different due to display and photography variations. We strive for accuracy, but minor differences may occur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All site content—including images, designs, and logos—are the property of Pradhikshaa Silks. Use is restricted to personal, non-commercial purposes only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Pradhikshaa Silks is not liable for indirect, consequential, or incidental damages arising from the use of our site or products. Our total liability shall not exceed the purchase price paid for the order.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Governing Law & Jurisdiction</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of Tamil Nadu, India. Any disputes will be subject to the exclusive jurisdiction of courts in Coimbatore, Tamil Nadu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We may update these Terms at any time. Continued use of our website and services implies acceptance of the latest version.
              </p>
            </section>

            <div className="mt-12 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Contact:</strong><br />
                Questions or concerns? Please contact us at:<br />
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

export default TermsConditions; 