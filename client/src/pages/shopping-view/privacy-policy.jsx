import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content below navbar */}
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-28">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">

            <p className="text-gray-700 mb-8">
              Pradhikshaa Silks is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your options.
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. What Information Do We Collect?</h2>
              <p className="text-gray-700 mb-4">
                When you place an order with us, we collect the following information to process your purchase and delivery:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Name</li>
                <li>Shipping address</li>
                <li>Phone number</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We do not ask for your email unless it's necessary for order communication.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How Do We Use Your Information?</h2>
              <p className="text-gray-700 mb-4">Your information is used to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Process and deliver your order</li>
                <li>Provide transaction updates and customer support</li>
                <li>Meet legal or regulatory requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Consent</h2>
              <p className="text-gray-700 mb-4">
                By providing your information to make a purchase, arrange a delivery, or request a return/exchange, you consent to our collecting and using your information for those specific purposes only.
              </p>
              <p className="text-gray-700 mb-4">
                If you wish to withdraw your consent at any time or request correction/deletion of your data, please contact us:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-800">
                  <strong>Email:</strong> pradhikshaasilks@gmail.com<br />
                  <strong>Phone:</strong> +91 99948 19203
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law or if you violate our Terms and Conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Payment Information</h2>
              <p className="text-gray-700 mb-4">
                Payments are processed securely through Razorpay. Razorpay may require certain information to complete your transaction (such as card details or UPI), and handles this information in compliance with industry security standards. We do not store your payment details.
              </p>
              <p className="text-gray-700 mb-4">
                For more information, please refer to Razorpay's Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We only share your delivery details with trusted shipping partners to fulfill your order. We do not sell or share your personal information with other third parties.
              </p>
              <p className="text-gray-700 mb-4">
                You may encounter links to other websites; we are not responsible for their privacy practices.
              </p>
              <p className="text-gray-700 mb-4">
                To analyze traffic and improve user experience, we use tools like Google Analytics, which may collect anonymized usage data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Security</h2>
              <p className="text-gray-700 mb-4">
                We use industry-standard security to protect your information from misuse, unauthorized access, or disclosure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Our website may use cookies (small data files) to support the shopping cart and enhance website performance. Most cookies are essential or used for analytics, and do not collect personally identifiable information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Age of Consent</h2>
              <p className="text-gray-700 mb-4">
                By using this site, you confirm you are at least the age of majority in your location or have given us consent to allow any minor dependents to use this site.
              </p>
            </section>

            <div className="mt-12 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Contact Information:</strong><br />
                For any questions about this Privacy Policy, please contact us at:<br />
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

export default PrivacyPolicy; 