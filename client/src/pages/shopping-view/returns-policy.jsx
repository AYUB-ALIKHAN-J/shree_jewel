import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ReturnsPolicy() {
  const navigate = useNavigate();

  // Helper component for the eligibility table
  const PolicyRow = ({ condition, eligible, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 py-4 border-b border-stone-200/80">
      <div className="font-semibold text-stone-800">{condition}</div>
      <div className="md:col-span-2">
        <div className="flex items-start gap-3">
          {eligible ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-stone-600">{children}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl pt-28 sm:pt-32">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-stone-600 hover:text-stone-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-2">Returns & Exchange Policy</h1>
        <p className="text-stone-500 mb-10">Last Updated: August 2, 2025</p>

        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12">
          <div className="prose prose-lg prose-stone max-w-none">
            
            <p className="lead !text-lg !text-stone-700 !mb-6">
              At SHREE JEWEL PALACE, we take immense pride in the craftsmanship of our jewelry. Each piece is carefully designed and handcrafted by skilled artisans, combining traditional techniques with contemporary styles to bring you luxury with comfort.
            </p>
            <p>
              Your satisfaction is our priority. Because every piece is made with care, we encourage you to inspect your order immediately upon receipt. Please note that returns and exchanges are only accepted under specific conditions to preserve the quality and integrity of our handcrafted products.
            </p>

            <section id="return-policy" className="my-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">What is the Return Policy?</h2>
              <div className="not-prose text-base space-y-2">
                <PolicyRow condition="Item damaged during transit" eligible={true}>
                  Must be reported within 24 hours with photographic evidence; product must be in original packaging and unused condition.
                </PolicyRow>
                <PolicyRow condition="Wrong product received" eligible={true}>
                  The exact product must be returned unused and in its original packaging.
                </PolicyRow>
                <PolicyRow condition="Minor color or design variations" eligible={false}>
                  Slight variations from website images are expected for handcrafted items and do not qualify for return or exchange.
                </PolicyRow>
                <PolicyRow condition="Personalized, engraved, or custom-made jewelry" eligible={false}>
                  These items are non-returnable unless they are defective upon delivery.
                </PolicyRow>
                <PolicyRow condition="Jewelry worn, resized, altered, or damaged post-delivery" eligible={false}>
                  Items showing any signs of use or alteration are not eligible for return or exchange.
                </PolicyRow>
              </div>
            </section>

            <section id="how-to-return" className="my-12">
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-8 !pb-3 !border-b !border-yellow-600/50">How to Exchange or Return</h2>
                <div className="not-prose space-y-8">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-yellow-700 font-bold text-xl">1</div>
                        <div>
                            <h4 className="font-semibold text-lg text-stone-800 mb-1">Contact Us</h4>
                            <p className="text-stone-600">Please email us at <a href="mailto:Shreejewelpalace1983@gmail.com" className="text-primary hover:underline">Shreejewelpalace1983@gmail.com</a> or WhatsApp us at <strong className="text-stone-700">+91 99943 65510</strong> with clear photographs of the product, original packaging, and a brief description of the issue.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-yellow-700 font-bold text-xl">2</div>
                        <div>
                            <h4 className="font-semibold text-lg text-stone-800 mb-1">Return Authorization</h4>
                            <p className="text-stone-600">Once your return or exchange request is approved, we will send you instructions and the return address.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-yellow-700 font-bold text-xl">3</div>
                        <div>
                            <h4 className="font-semibold text-lg text-stone-800 mb-1">Shipping Your Return</h4>
                            <p className="text-stone-600">You may choose any reliable courier service to ship the item back to SHREE JEWEL PALACE. Please ensure you retain proof of postage and a tracking number to monitor the return shipment.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-yellow-700 font-bold text-xl">4</div>
                        <div>
                            <h4 className="font-semibold text-lg text-stone-800 mb-1">Inspection & Update</h4>
                            <p className="text-stone-600">Upon receipt, our quality team will inspect the returned item. If it meets the return criteria, we will process your exchange or refund accordingly. We will update you about the next steps via email or WhatsApp.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="important-notes" className="my-12">
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">Important Notes</h2>
                <ul className="!space-y-3">
                    <li>Returns must be initiated within 7 days of delivery.</li>
                    <li>Only unused items in their original packaging with all tags and certificates intact are eligible.</li>
                    <li>Shipping charges for returns in case of damaged or wrong items will be borne by SHREE JEWEL PALACE.</li>
                    <li>For other returns initiated by the customer, the shipping cost for the return shipment will be the customer's responsibility unless otherwise agreed.</li>
                    <li>Exchanges are subject to product availability; if the requested item is unavailable, store credit or a refund will be offered.</li>
                    <li>Please allow 7-15 business days for processing returns and exchanges after our receipt of the returned item.</li>
                </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnsPolicy;