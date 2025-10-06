import { Outlet, useLocation } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";
import { useEffect, useState } from "react";

function ShoppingLayout() {
  const [showScrollUp, setShowScrollUp] = useState(false);
  const location = useLocation();

  // Define pages where footer should be shown
  const footerPages = [
    "/shop/home",
    "/shop/about-us",
    "/shop/terms-conditions",
    "/shop/privacy-policy",
    "/shop/returns-policy",
    "/shop/refund-policy",
    "/shop/shipping-policy"
  ];

  // Check if current page should show footer
  const shouldShowFooter = footerPages.includes(location.pathname);

  useEffect(() => {
    function handleScroll() {
      setShowScrollUp(window.scrollY > 200);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Listen for custom event from header Home button
  useEffect(() => {
    function handleHomeScrollUp(e) {
      if (e.detail === "home-scroll-up") {
        // Use setTimeout to ensure scroll happens after navigation
        setTimeout(() => scrollToTop(), 10);
      }
    }
    window.addEventListener("shopping-home-scroll", handleHomeScrollUp);
    return () => window.removeEventListener("shopping-home-scroll", handleHomeScrollUp);
  }, []);

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
      {/* Footer - only show on specific pages */}
      {shouldShowFooter && <ShoppingFooter />}
      {showScrollUp && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-24 sm:bottom-24 z-50 bg-primary text-white rounded-full shadow-lg p-3 hover:bg-primary/90 transition-all"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
      )}
    </div>
  );
}

export default ShoppingLayout;
