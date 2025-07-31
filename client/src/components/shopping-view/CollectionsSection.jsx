import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const aboutUsImageSections = [
    {
        src: "https://res.cloudinary.com/ddvxciphm/image/upload/v1749540547/Soft_silk_sarees_bwtpu7.jpg",
        alt: "Soft Silk Sarees",
        title: "SAMAVE",
        description: "Inspired by the grace of a royal heirloom, this collection is a sublime romance of art and craftsmanship.",
    },
    {
        src: "https://res.cloudinary.com/ddvxciphm/image/upload/v1749540548/TUSSAR_SILK_s6kdgu.jpg",
        alt: "Tussar Silk Sarees",
        title: "Beyond",
        description: "A whimsical collection that reimagines the surreal beauty of flora and fauna in a contemporary vein.",
    },
    {
        src: "https://res.cloudinary.com/ddvxciphm/image/upload/v1749540551/Kalamkari_Dupata_ppmob9.jpg",
        alt: "Kalamkari Dupattas",
        title: "Kalamkari",
        description: "Hand-painted and block-printed dupattas that tell stories through fabric art.",
    },
    {
        src: "https://res.cloudinary.com/ddvxciphm/image/upload/v1749540551/Linen_Sarees_izcsim.jpg",
        alt: "Linen Sarees",
        title: "Modern Linen",
        description: "Breathable and elegant, Linen Sarees offer a minimal yet sophisticated look.",
    },
    {
        src: "https://res.cloudinary.com/ddvxciphm/image/upload/v1749540548/ORGANZA_SILK_evitrx.jpg",
        alt: "Organza Sarees",
        title: "Sheer Organza",
        description: "Known for their sheer texture and ethereal beauty, adding grace to any celebration.",
    },
];

function CollectionsSection() {
    const containerRef = useRef(null);
    const panelsRef = useRef([]);
    const textRefs = useRef([]);
    const imageRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const panels = panelsRef.current;
            
            // Animation for each panel's content
            panels.forEach((panel, index) => {
                const text = textRefs.current[index];
                const image = imageRefs.current[index];
                
                // Initial state
                gsap.set([text, image], {
                    opacity: 0,
                    y: 50
                });
                
                // Animate in when panel comes into view
                ScrollTrigger.create({
                    trigger: panel,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => {
                        gsap.to(text, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power3.out"
                        });
                        gsap.to(image, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            delay: 0.2,
                            ease: "power3.out"
                        });
                    },
                    onLeaveBack: () => {
                        gsap.to([text, image], {
                            opacity: 0,
                            y: 50,
                            duration: 0.5
                        });
                    }
                });
            });
            
            // Horizontal scroll animation
            gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 0.5,
                    end: () => `+=${containerRef.current.offsetWidth * (panels.length - 1)}`,
                    markers: false
                }
            });

        }, containerRef);
        
        return () => ctx.revert();
    }, []);

    return (
        <section className="relative bg-white">
            <div ref={containerRef} className="h-screen w-full overflow-hidden">
                <div className="h-full flex">
                    {aboutUsImageSections.map((collection, index) => (
                        <div 
                            key={index}
                            ref={el => panelsRef.current[index] = el}
                            className="panel h-full w-full flex-shrink-0 flex items-center justify-center px-4"
                        >
                            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                                {/* Text content with animation */}
                                <div 
                                    ref={el => textRefs.current[index] = el}
                                    className="text-center md:text-left space-y-6"
                                >
                                    <h3 className="text-4xl md:text-5xl font-serif text-gray-900">
                                        {collection.title}
                                    </h3>
                                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-md mx-auto md:mx-0">
                                        {collection.description}
                                    </p>
                                    <button className="px-8 py-3 bg-[#D4AF37] text-white rounded-full hover:bg-[#C19A3B] transition-all duration-300 transform hover:scale-105">
                                        View Collection
                                    </button>
                                </div>
                                
                                {/* Tight image container without extra space */}
                                <div 
                                    ref={el => imageRefs.current[index] = el}
                                    className="relative w-full h-[50vh] md:h-[70vh]"
                                >
                                    <img
                                        src={collection.src}
                                        alt={collection.alt}
                                        className="absolute inset-0 w-full h-full object-cover transform transition-all duration-1000 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CollectionsSection;