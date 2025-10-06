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
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/shreejewelpalace.in?igsh=MTlqcDRxdDA5ZHlzeg==" },
  ];

  return (
    <footer className="bg-[#111827] text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Shree Jewel Palace" className="h-12 w-12 object-contain bg-white/10 rounded-full p-1" />
              <span className="text-xl font-serif font-bold text-white">Shree Jewel Palace</span>
            </div>
            <p className="text-gray-400 text-sm">
                Exquisite jewelry crafted with passion and precision.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links & Policies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:col-span-2">
            <div>
                <h3 className="text-lg font-semibold font-serif text-[#D4AF37] mb-4">Quick Links</h3>
                <ul className="space-y-3">
                {quickLinks.map((link) => (
                    <li key={link.name}>
                    <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        {link.name}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold font-serif text-[#D4AF37] mb-4">Policies</h3>
                <ul className="space-y-3">
                {policyLinks.map((link) => (
                    <li key={link.name}>
                    <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        {link.name}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-serif text-[#D4AF37] mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Coimbatore, Tamilnadu, India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a
                  href="tel:+91-9994365510"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  +91 99943 65510
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a
                  href="mailto:Shreejewelpalace1983@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Shreejewelpalace1983@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} Shree Jewel Palace. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/shop/terms-conditions" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</Link>
              <Link to="/shop/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</Link>
              <Link to="/shop/returns-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Returns</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;
