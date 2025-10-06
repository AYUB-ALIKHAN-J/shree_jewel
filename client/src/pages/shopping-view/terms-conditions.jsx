import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function TermsConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl pt-28 sm:pt-32">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-stone-600 hover:text-stone-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-2">Terms & Conditions</h1>
        <p className="text-stone-500 mb-10">Last Updated: August 1, 2025</p>

        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12">
          <div className="prose prose-lg prose-stone max-w-none">
            
            <p className="lead !text-lg !text-stone-700 !mb-10">
              Welcome to SHREE JEWEL PALACE. By using our website and purchasing our products, you agree to the following terms and conditions.
            </p>
            
            <section className="mb-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">1. Sale and Purchase</h2>
              <p>
                By placing an order on shreejewelpalace.com, you (“Buyer”) agree to purchase products (“Goods”) as described at checkout, subject to these Terms. SHREE JEWEL PALACE reserves the right to accept or decline any order at our sole discretion.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">2. Prices & Payments</h2>
              <ul className="!space-y-3">
                <li>All prices are listed in Indian Rupees (INR) and include applicable taxes.</li>
                <li>Full payment is required at the time of checkout.</li>
                <li>Secure payment processing is provided via trusted payment gateways (such as Razorpay, Paytm, or equivalent).</li>
                <li>Prices and product availability are subject to change without notice.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">3. Delivery</h2>
              <ul className="!space-y-3">
                <li>Orders will be shipped in line with our Shipping Policy.</li>
                <li>Delivery dates are estimates and may be affected by circumstances beyond our control, including customs delays, holidays, or other unforeseen events.</li>
                <li>SHREE JEWEL PALACE is not liable for delays outside our direct control.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">4. Customs, Duties & Taxes</h2>
              <ul className="!space-y-3">
                <li>For international shipments, recipients are responsible for any import duties, taxes, or customs fees.</li>
                <li>These charges are not included in the purchase price and must be paid by the recipient upon arrival in the destination country.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">5. Product Disclaimer</h2>
              <ul className="!space-y-3">
                <li>Product images and descriptions are provided as accurately as possible. However, colors may appear slightly different due to device displays or lighting conditions during photography.</li>
                <li>Minor variations in color, pattern, or design may occur.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">6. Intellectual Property</h2>
              <ul className="!space-y-3">
                <li>All content on shreejewelpalace.com—including images, product designs, graphics, text, and logos—are the exclusive property of SHREE JEWEL PALACE.</li>
                <li>Use is restricted to personal, non-commercial purposes. Any unauthorized use, reproduction, or distribution is strictly prohibited.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">7. Limitation of Liability</h2>
              <ul className="!space-y-3">
                <li>SHREE JEWEL PALACE is not liable for indirect, consequential, or incidental damages resulting from the use of our website or products.</li>
                <li>Our maximum liability for any claim related to a purchase is limited to the total purchase price paid for that order.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">8. Governing Law & Jurisdiction</h2>
              <ul className="!space-y-3">
                <li>These Terms are governed by the laws of India, with exclusive jurisdiction of courts located at Coimbatore, Tamil Nadu.</li>
                <li>Any disputes arising from your use of the site or purchase of our products will be subject to these courts.</li>
              </ul>
            </section>

            <section>
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">9. Changes to Terms</h2>
              <ul className="!space-y-3">
                <li>We reserve the right to update or modify these Terms and Conditions at any time without prior notice.</li>
                <li>Continued use of our website or services will be interpreted as acceptance of the latest version of these Terms.</li>
              </ul>
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;