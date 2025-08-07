import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function RefundPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl pt-28 sm:pt-32">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-stone-600 hover:text-stone-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-2">Refund Policy</h1>
        <p className="text-stone-500 mb-10">Last Updated: August 2, 2025</p>

        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12">
          <div className="prose prose-lg prose-stone max-w-none">
            
            <p className="lead !text-lg !text-stone-700 !mb-6">
              We do not accept returns or offer refunds unless the product delivered is damaged or defective. Your eligibility for a refund is subject to the conditions outlined below.
            </p>

            <section id="refund-eligibility" className="my-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">Eligibility for a Refund</h2>
              <p>You may be eligible for a refund only under the following conditions:</p>
              <ul className="!space-y-3 !mt-4">
                <li>The product received is damaged, defective, or incorrect.</li>
                <li>You notify us within 48 hours of delivery about the issue.</li>
                <li>The item must be unused, in its original condition, and accompanied by all original packaging, tags, invoices, and certificates.</li>
              </ul>
              <div className="mt-6 p-4 bg-red-50/50 border-l-4 border-red-500 rounded-r-lg">
                <h4 className="font-bold text-red-900">Not Eligible for Refund</h4>
                <p className="text-red-800/90 mt-1">
                  Customization requests (such as engraved items, resizing, or bespoke designs) and items sold under promotional discounts are considered final sale and are not eligible for return or refund.
                </p>
              </div>
            </section>

            <section id="how-to-report" className="my-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-8 !pb-3 !border-b !border-yellow-600/50">How to Report an Issue</h2>
               <div className="not-prose space-y-8">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-yellow-700 font-bold text-xl">1</div>
                        <div>
                            <h4 className="font-semibold text-lg text-stone-800 mb-1">Contact Customer Care</h4>
                            <p className="text-stone-600">Reach out to our team within 48 hours of delivery via Phone at <strong className="text-stone-700">+91 99943 65510</strong> or Email at <a href="mailto:Shreejewelpalace1983@gmail.com" className="text-primary hover:underline">Shreejewelpalace1983@gmail.com</a>.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-yellow-700 font-bold text-xl">2</div>
                        <div>
                            <h4 className="font-semibold text-lg text-stone-800 mb-1">Provide Evidence</h4>
                            <p className="text-stone-600">Send clear photos and/or videos of the item showing evidence of the damage or defect.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-yellow-700 font-bold text-xl">3</div>
                        <div>
                            <h4 className="font-semibold text-lg text-stone-800 mb-1">Follow Return Instructions</h4>
                            <p className="text-stone-600">Upon verification, we will guide you through the return process. The item must be securely packed and shipped back to us within 7 days of approval.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="refund-process" className="my-12">
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">Refund Processing</h2>
                <ul className="!space-y-3">
                    <li>Once the returned item is received and inspected, you will receive a notification on the status of your refund.</li>
                    <li>If approved, the refund will be processed to your original method of payment within 7–10 business days.</li>
                    <li>If your payment was deducted during a failed transaction, refunds are typically issued within 5–7 business days after our verification.</li>
                </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefundPolicy;