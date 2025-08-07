import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ShippingPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl pt-28 sm:pt-32">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-stone-600 hover:text-stone-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-2">Shipping Policy</h1>
        <p className="text-stone-500 mb-10">Last Updated: August 1, 2025</p>

        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12">
          <div className="prose prose-lg prose-stone max-w-none">
            
            <section id="domestic-shipping" className="mb-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">Domestic Shipping</h2>
              <ul className="!space-y-3">
                <li>Free shipping on all prepaid orders within India.</li>
                <li>Orders are typically delivered within 4-7 working days; made-to-order or customized pieces may require 15-45 days.</li>
                <li>Once dispatched, a tracking number will be provided. All orders are shipped via reputed courier partners.</li>
                <li>Delivery times may vary due to destination, product availability, or external circumstances.</li>
              </ul>
            </section>

            <section id="international-shipping" className="mb-12">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">International Shipping</h2>
              <ul className="!space-y-3">
                <li>Shipping charges and delivery timelines are calculated at checkout and vary by destination.</li>
                <li>Customers are responsible for any customs duties or taxes applicable at the destination country.</li>
              </ul>
            </section>

            <section id="contact" className="mt-16">
                 <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">Questions About Shipping?</h2>
                 <p>For any inquiries regarding your shipment or our policies, please feel free to contact us.</p>
                 <div className="mt-6 bg-stone-100 border-l-4 border-yellow-600 p-6 rounded-r-lg text-stone-800 not-prose">
                    <p className="my-0"><strong>Email:</strong> <a href="mailto:Shreejewelpalace1983@gmail.com" className="text-primary hover:underline">Shreejewelpalace1983@gmail.com</a></p>
                    <p className="my-2"><strong>Phone:</strong> +91 99943 65510</p>
                </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingPolicy;