import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

function ShoppingFooter() {
  const currentYear = new Date().getFullYear();

  const policyLinks = [
    { name: "Terms & Conditions", path: "/shop/terms-conditions" },
    { name: "Privacy Policy", path: "/shop/privacy-policy" },
    { name: "Returns & Exchange", path: "/shop/returns-policy" },
    { name: "Refund Policy", path: "/shop/refund-policy" },
    { name: "Shipping Policy", path: "/shop/shipping-policy" },
  ];

  const quickLinks = [
    { name: "Home", path: "/shop/home" },
    { name: "Products", path: "/shop/listing" },
    { name: "About Us", path: "/shop/about-us" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/Pradhikshaasilks" },
  ];

  // Gold color: #C2882B, deeper gold: #A06A17
  return (
    <footer className="bg-white text-gray-900 border-t border-[#f3e6c4]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Pradhikshaa Silks" className="h-12 w-12 object-contain" />
              <span className="text-xl font-bold text-[#C2882B]">Pradhikshaa Silks</span>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C2882B] hover:text-[#A06A17] transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#C2882B]">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-700 hover:text-[#C2882B] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#C2882B]">Policies</h3>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-700 hover:text-[#C2882B] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#C2882B]">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#C2882B]" />
                <span className="text-gray-700 text-sm">
                  Coimbatore, Tamilnadu, India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C2882B]" />
                <a
                  href="tel:+91-99948 19203"
                  className="text-gray-700 hover:text-[#C2882B] transition-colors text-sm"
                >
                  +91-99948 19203
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C2882B]" />
                <a
                  href="mailto:pradhikshaasilks@gmail.com"
                  className="text-gray-700 hover:text-[#C2882B] transition-colors text-sm"
                >
                  pradhikshaasilks@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#f3e6c4] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} Pradhikshaa Silks. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/shop/terms-conditions"
                className="text-gray-700 hover:text-[#C2882B] transition-colors text-sm"
              >
                Terms
              </Link>
              <Link
                to="/shop/privacy-policy"
                className="text-gray-700 hover:text-[#C2882B] transition-colors text-sm"
              >
                Privacy
              </Link>
              <Link
                to="/shop/returns-policy"
                className="text-gray-700 hover:text-[#C2882B] transition-colors text-sm"
              >
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter; 