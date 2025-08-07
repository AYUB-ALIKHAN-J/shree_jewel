import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl pt-28 sm:pt-32">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-stone-600 hover:text-stone-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-2">Privacy Policy</h1>
        <p className="text-stone-500 mb-10">Last Updated: August 1, 2025</p>

        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12">
          <div className="prose prose-lg prose-stone max-w-none">

            <p className="lead !text-lg !text-stone-700 !mb-10">
              SHREE JEWEL PALACE ("we", "our", "us") is committed to protecting your privacy and ensuring transparency regarding your personal data. This Privacy Policy explains what information we collect, how we use it, your options, and the steps we take to safeguard your data.
            </p>

            {/* --- Policy Sections --- */}
            <section className="mb-10">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">1. What Information Do We Collect?</h2>
              <p>We collect information necessary to process orders, fulfill deliveries, and improve our services:</p>
              <ul className="!mt-4 !space-y-2">
                <li>Name</li>
                <li>Shipping and billing address</li>
                <li>Phone number</li>
                <li>Email address (when required for order communication or customer support)</li>
                <li>Payment information (handled securely via external payment gateways)</li>
                <li>Device & browser details (IP address, browser type, operating system for analytics, fraud prevention, and security)</li>
                <li>Order and customer service interaction history</li>
              </ul>
              <p>Additionally, we may use cookies to collect anonymized data about how you use our site for analytics and website enhancement purposes.</p>
            </section>
            
            <section className="mb-10">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">2. How Do We Use Your Information?</h2>
              <p>Your information is used to:</p>
              <ul className="!mt-4 !space-y-2">
                  <li>Process, confirm, and deliver your order</li>
                  <li>Provide transaction status and customer support</li>
                  <li>Meet legal/accounting, KYC, or regulatory requirements</li>
                  <li>Personalize and improve your Browse experience</li>
                  <li>Send promotional emails or offers (only with your explicit consent; opt-out available at any time)</li>
                  <li>Prevent or detect fraud and abuse on our site</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">3. Consent</h2>
              <p>By providing your personal information (for purchase, delivery, returns, or support), you consent to our collecting and using it strictly for those purposes. If we need your data for secondary uses (e.g., marketing), we will request your explicit consent.</p>
              <p>You may withdraw consent, or request correction or deletion of your data at any time by contacting our support (see Section 11).</p>
            </section>

            <section className="mb-10">
              <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">4. Disclosure of Information</h2>
              <p>We may disclose your data:</p>
               <ul className="!mt-4 !space-y-2">
                  <li>When required to comply with the law, legal processes, or to enforce our Terms and Conditions</li>
                  <li>To trusted service providers necessary to fulfill your order (courier, payment gateway compliance, technical support), all bound by confidentiality and data protection agreements</li>
                  <li>To authorities for fraud prevention, security, or legal investigations</li>
              </ul>
              <p>We do not sell or trade your personal data. Aggregated, anonymized statistics may be shared for marketing or analytics, but do not contain personally identifiable details.</p>
            </section>

            <section className="mb-10">
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">5. Payment Information</h2>
                <p>All payments are processed securely through established payment gateways (such as Razorpay, Paytm, UPI, credit/debit cards). We do not store your payment card or bank details on our servers. The payment processors adhere to PCI DSS and other industry standards to ensure transaction safety and privacy.</p>
                <p>For further details, refer to the privacy policy of our payment partners.</p>
            </section>

            <section className="mb-10">
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">6. Third-Party Services & Links</h2>
                <p>We only share delivery and contact details with trusted logistics and payment partners to fulfill orders. We are not responsible for the privacy practices of external websites linked from our store. We recommend you review their respective privacy policies.</p>
                <p>We may use third-party analytics tools (such as Google Analytics) which collect anonymized usage data to help us improve site functionality.</p>
            </section>

            <section className="mb-10">
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">7. Children’s Privacy</h2>
                <p>We do not knowingly collect information from children under 18. If you are a minor, use our site only with parent/guardian consent. If you believe your child has provided us information, please contact us for prompt removal.</p>
            </section>

            <section className="mb-10">
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">8. Security</h2>
                <p>We adopt industry-standard security protocols (e.g., SSL encryption, secure servers) to prevent misuse, loss, unauthorized access, alteration, or disclosure of your data. Access is limited to authorized personnel, and regular security audits are conducted.</p>
            </section>

            <section className="mb-10">
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">9. Cookies</h2>
                <p>Our website uses cookies and similar technologies to:</p>
                <ul className="!mt-4 !space-y-2">
                  <li>Enable shopping cart and order functions</li>
                  <li>Remember your login/session settings</li>
                  <li>Gather statistics to improve performance</li>
              </ul>
              <p>Most cookies are essential or used only for anonymized analytics. You may disable cookies via your browser settings, but some features may not function correctly.</p>
            </section>

            <section className="mb-10">
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">10. Data Retention & User Rights</h2>
                <p>We retain order and communications data as required by law for taxation and business records.</p>
                <ul className="!mt-4 !space-y-2">
                  <li>You have the right to access, correct, update, or delete your personal data.</li>
                  <li>You can opt out of non-essential communications at any time by using the unsubscribe link or contacting support.</li>
                  <li>You may request details of your personal data or raise privacy concerns with our Grievance Officer.</li>
              </ul>
            </section>
            
            <section className="mb-10">
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">11. Contact & Grievance Redressal</h2>
                <p>For data access, correction, consent withdrawal, deletion requests, or complaints, contact:</p>
                <div className="mt-4 bg-stone-100 border-l-4 border-yellow-600 p-6 rounded-r-lg text-stone-800">
                    <p className="!my-0"><strong>Email:</strong>Shreejewelpalace1983@gmail.com</p>
                    <p className="!my-2"><strong>Phone:</strong> +91 99943 65510</p>
                    {/* --- FIXED IFRAME --- */}
                   
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1692.07647716748!2d76.96512028431117!3d11.017061755465368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba858fef237a0eb%3A0x3a91f86b4178e40b!2sShree%20Jewel%20palace!5e0!3m2!1sen!2sin!4v1754290733225!5m2!1sen!2sin"
                      width="100%"
                      height="450"
                      style={{ border: 0, marginTop: '1rem', borderRadius: '8px' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>
            
            <section>
                <h2 className="!font-serif !text-2xl !font-semibold !text-stone-900 !mb-6 !pb-3 !border-b !border-yellow-600/50">12. Changes to This Privacy Policy</h2>
                <p>This policy may be updated from time to time to reflect operational, legal, or regulatory changes. The updated policy will be posted on this page. Continued use of the site indicates acceptance of changes.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;