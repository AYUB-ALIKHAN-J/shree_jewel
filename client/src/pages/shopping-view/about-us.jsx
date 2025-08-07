import React, { useLayoutEffect, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import UI components and icons
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck, Gem, Star } from "lucide-react";

import instaLogo from "@/assets/insta-logo.png";
import whatsappLogo from "@/assets/whatsapp-logo.png";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// === NEW: Rewritten and re-imaged for Shree Jewell Palace ===
const collectionsData = [
  {
    src: "https://res.cloudinary.com/dphxdgu4n/image/upload/v1754120695/necklace_n32zjp.webp",
    alt: "Necklace",
    title: "The Timeless Strand",
    description: "A celebration of timeless elegance. Our necklaces are meticulously crafted to capture and reflect light, designed to be the graceful centerpiece of any look.",
    collectionId: "Necklace"
  },
  {
    src: "https://res.cloudinary.com/dphxdgu4n/image/upload/v1754120587/ring_hqh1fe.webp",
    alt: "Ring",
    title: "The Emblem of Adornment",
    description: "More than just a ring, it's a statement. Our collection embodies masterful design and exquisite craftsmanship, made to be cherished for a lifetime.",
    collectionId: "Ring"
  },
  {
    src: "https://res.cloudinary.com/dphxdgu4n/image/upload/v1754120587/bangles_jrlr01.webp",
    alt: "Bangles",
    title: "The Art of the Wrist",
    description: "Adorn your wrist with sculptural beauty. Our bangles are a celebration of bold, graceful lines, perfect for stacking or shining as a singular statement.",
    collectionId: "Bangles"
  },
  {
    src: "https://res.cloudinary.com/dphxdgu4n/image/upload/v1754120587/bracelet_lziolo.webp",
    alt: "Bracelet",
    title: "The Signature Link",
    description: "Elevate every gesture with a touch of luxury. From delicate chains to powerful cuffs, each bracelet is a perfect blend of modern allure and classic charm.",
    collectionId: "Bracelet"
  },
  {
    src: "https://res.cloudinary.com/dphxdgu4n/image/upload/v1754120587/earings_wf9xar.jpg",
    alt: "Earrings",
    title: "The Luster of Light",
    description: "Frame your features with brilliance. Our earrings are designed to capture every glance, illuminating your natural radiance with every style from subtle studs to dramatic drops.",
    collectionId: "Earrings"
  }
];

const whyChooseUsData = [
    {
        icon: Gem,
        title: "Master Craftsmanship",
        description: "Every piece is a work of art, meticulously crafted by skilled artisans who honor generations of jewelry-making traditions."
    },
    {
        icon: Star,
        title: "Unmatched Purity",
        description: "We guarantee the finest quality materials, from certified precious metals to ethically sourced gemstones, ensuring lasting value."
    },
    {
        icon: ShieldCheck,
        title: "A Legacy of Trust",
        description: "We are committed to building lifelong relationships with our clients through transparency, integrity, and exceptional service."
    }
]

function AboutUs() {
  const location = useLocation();
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        gsap.utils.toArray(".animate-on-scroll").forEach(elem => {
            gsap.from(elem, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none none",
                }
            });
        });
        
        gsap.from(".why-choose-us-card", {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".why-choose-us-grid",
                start: "top 80%",
                toggleActions: "play none none none",
            }
        });

    }, mainRef);
    
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (location.hash === "#policies") {
      const el = document.getElementById("policies");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [location]);

  return (
    <div ref={mainRef} className="bg-background text-foreground min-h-screen mt-16 font-sans">
      
      <section className="py-24 md:py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6 animate-on-scroll">
            Shree Jewell Palace
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed animate-on-scroll">
            A sanctuary of timeless elegance and masterful craftsmanship, where every piece tells a story of heritage and luxury.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Collections</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our carefully curated selection, each telling a unique story of artistry and devotion.
            </p>
          </div>

          <div className="space-y-24">
            {collectionsData.map((collection, index) => (
              <div
                key={collection.title}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="flex-1 w-full max-w-lg animate-on-scroll">
                  <img
                    src={collection.src}
                    alt={collection.alt}
                    className="w-full h-auto object-cover rounded-lg shadow-xl"
                  />
                </div>
                <div className="flex-1 space-y-4 animate-on-scroll">
                  <h3 className="text-3xl font-serif text-primary tracking-wide">
                    {collection.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {collection.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">The Shree Jewell Palace Promise</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the difference that passion, purity, and dedication make in every creation.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 why-choose-us-grid">
            {whyChooseUsData.map((item, index) => (
                <div key={index} className="bg-background rounded-lg shadow-lg p-8 text-center why-choose-us-card">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <item.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section id="policies" className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Policies</h2>
            <p className="text-xl text-muted-foreground">Transparent, Fair, and Customer-Focused.</p>
          </div>
          <Accordion type="single" collapsible className="w-full animate-on-scroll">
          <AccordionItem value="item-1">
  <AccordionTrigger className="text-xl font-serif">Return Policy</AccordionTrigger>
  <AccordionContent className="pt-4 text-muted-foreground leading-relaxed space-y-4">
    <p>Returns are accepted within 7 days of delivery for damaged items during transit or wrong products received. Items must be unused, in original packaging with all tags intact.</p>
    <p><strong>Process:</strong> Email at <a href="mailto:Shreejewelpalace1983@gmail.com" className="text-primary hover:underline">Shreejewelpalace1983@gmail.com</a> or WhatsApp : <strong className="text-stone-700">+91 99943 65510</strong>  with clear photographs and product description. Once approved, ship using any reliable courier with tracking. Personalized/custom jewelry and items with minor color variations are not eligible for return.</p>
    <p><strong>Shipping:</strong> We cover shipping costs for damaged/wrong items. Customer pays for other returns. Processing takes 7-15 business days.</p>
  </AccordionContent>
</AccordionItem>

<AccordionItem value="item-2">
  <AccordionTrigger className="text-xl font-serif">Exchange Policy</AccordionTrigger>
  <AccordionContent className="pt-4 text-muted-foreground leading-relaxed">
    <p>Exchanges are available within 7 days of delivery for damaged items during transit or wrong products received. Items must be unused, in original packaging with all tags intact. Same notification process as returns - contact via email or WhatsApp with photographs.</p>
    <p><strong>Important:</strong> Exchanges subject to product availability. If unavailable, store credit or refund offered. We cover shipping for damaged/wrong items; customer pays for other exchanges. Processing takes 7-15 business days.</p>
  </AccordionContent>
</AccordionItem>

            {/* <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-serif">Cancellation Policy</AccordionTrigger>
              <AccordionContent className="pt-4 text-muted-foreground leading-relaxed">
                Orders can be fully cancelled before they are shipped. Once an item has been shipped, cancellation is not possible. Please contact us immediately if you wish to cancel.
              </AccordionContent>
            </AccordionItem> */}
          </Accordion>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-serif mb-8">Connect With Us</h2>
            <div className="flex justify-center items-center gap-8">
                <a href="https://www.instagram.com/shreejewelpalace.in?igsh=MTlqcDRxdDA5ZHlzeg==" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                    <img src={instaLogo} alt="Instagram" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"/>
                    <span className="text-muted-foreground group-hover:text-primary">@shreejewellpalace</span>
                </a>
                <a href="https://wa.me/919994365510" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
    <img src={whatsappLogo} alt="WhatsApp" className="w-12 h-12 p-2 object-contain group-hover:scale-110 transition-transform"/>
    <span className="text-muted-foreground group-hover:text-primary">+91 99943 65510</span>
</a>

            </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;