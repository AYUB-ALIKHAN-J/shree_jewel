import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from 'react-router-dom';


gsap.registerPlugin(ScrollTrigger);

const luxuryCollections = [
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

const LuxuryCollectionsSection = () => {
  const containerRef = useRef(null);
  const panelsRef = useRef([]);
  const textRefs = useRef([]);
  const imageRefs = useRef([]);
  const buttonRefs = useRef([]);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = panelsRef.current;
      
      // Set initial states
      gsap.set([...textRefs.current, ...imageRefs.current], {
        opacity: 0,
        y: 100
      });
      
      gsap.set(buttonRefs.current, {
        opacity: 0,
        y: 30
      });

      // Panel animations
      panels.forEach((panel, index) => {
        const text = textRefs.current[index];
        const image = imageRefs.current[index];
        const button = buttonRefs.current[index];

        ScrollTrigger.create({
          trigger: panel,
          start: "top 75%",
          end: "bottom 25%",
          onEnter: () => {
            const tl = gsap.timeline();
            tl.to(text, {
              opacity: 1,
              y: 0,
              duration: 1.4,
              ease: "expo.out"
            })
            .to(image, {
              opacity: 1,
              y: 0,
              duration: 1.4,
              ease: "expo.out"
            }, 0.2)
            .to(button, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "back.out"
            }, 0.6);
          },
          onLeaveBack: () => {
            gsap.to([text, image, button], {
              opacity: 0,
              y: 100,
              duration: 0.8
            });
          }
        });
      });

      // Horizontal scroll animation
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "smooth.out(1.7)",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${containerRef.current.offsetWidth * (panels.length - 1)}`,
          markers: false
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-[#f8f4ee] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#3a5f0b] to-transparent opacity-10"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#3a5f0b] to-transparent opacity-10"></div>
      </div>

      <div ref={containerRef} className="w-full lg:h-screen lg:overflow-hidden">
        <div className="h-full flex">
          {luxuryCollections.map((collection, index) => (
            <div 
              key={collection.collectionId}
              ref={el => panelsRef.current[index] = el}
              className="panel w-full flex-shrink-0 flex items-center justify-center px-6 sm:px-12 md:px-24 py-24 lg:py-0 lg:h-full"
            >
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                {/* Text content */}
                <div 
                  ref={el => textRefs.current[index] = el}
                  className="text-center lg:text-left space-y-8 lg:space-y-12"
                >
                  <div className="overflow-hidden">
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1a1a1a] tracking-tight leading-tight">
                      {collection.title}
                    </h3>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-lg md:text-xl text-[#555] leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                      {collection.description}
                    </p>
                  </div>
                  <div className="overflow-hidden">
                    <button
                      ref={el => buttonRefs.current[index] = el}
                      onClick={() => navigate('/shop/listing')}
                      className="px-12 py-4 bg-[#004225] hover:bg-[#004225]/90 text-white rounded-full transition-all duration-500 ease-out hover:scale-105 text-lg font-medium tracking-wider shadow-md hover:shadow-lg group"
                    >
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                        Explore Collection
                      </span>
                      <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-2">
                        →
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Image container */}
                <div
                  ref={el => imageRefs.current[index] = el}
                  className="relative w-full h-[30vh] lg:h-[65vh] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]"
                >
                  <img
                    src={collection.src}
                    alt={collection.alt}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-50 ease-in-out"
                    loading="lazy"
                    onLoad={(e) => { e.target.classList.remove('opacity-0'); }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/20"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LuxuryCollectionsSection;