import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import StarRating from "@/components/common/star-rating";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Quote, Star, User, ExternalLink, QrCode, MessageCircle, ArrowRight } from "lucide-react";
import googleReviewQr from "../../assets/google-review-qr.jpeg";

// --- CONFIGURATION ---
const GOOGLE_REVIEW_LINK = "https://g.page/r/CXDrLf_SMBD1EAI/review";

// --- API HELPERS ---
async function fetchReviews() {
  const res = await fetch("/api/shop/review/all");
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

async function postReview({ userId, userName, reviewMessage, reviewValue }) {
  const res = await fetch("/api/shop/review/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, userName, reviewMessage, reviewValue }),
    credentials: "include",
  });
  return res.json();
}

// --- MAIN COMPONENT ---
export default function ReviewCarousel() {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGoogleQR, setShowGoogleQR] = useState(false);
  const swiperRef = useRef(null);
  
  // Form state
  const [form, setForm] = useState({ rating: 0, text: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews on mount
  useEffect(() => {
    setLoading(true);
    fetchReviews()
      .then((data) => {
        setReviews(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load reviews");
        setLoading(false);
      });
  }, []);

  // Handle form input
  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError("");
  }

  // Validate and submit review
  async function handleSubmit(e) {
    e.preventDefault();
    if (form.rating < 1 || form.rating > 5) {
      setFormError("Please select a star rating.");
      return;
    }
    if (!form.text.trim()) {
      setFormError("Please share your experience.");
      return;
    }
    if (form.text.length > 500) {
      setFormError("Review text must be under 500 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await postReview({
        userId: user?.id,
        userName: user?.name || "Anonymous",
        reviewMessage: form.text,
        reviewValue: form.rating,
      });
      if (result.success) {
        setShowModal(false);
        setForm({ rating: 0, text: "" });
        setFormError("");
        fetchReviews().then((data) => setReviews(data.data || []));
        toast({ title: "Thank you for your review!" });
      } else {
        setFormError(result.message || "Failed to submit review.");
      }
    } catch (err) {
      setFormError("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  // Handle Google Review redirect
  const handleGoogleReview = () => {
    window.open(GOOGLE_REVIEW_LINK, "_blank", "noopener,noreferrer");
  };

  // Render star rating display
  const renderStars = (rating) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50/20 via-white to-green-50/20 border-t">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Don't just take our word for it—hear from our satisfied customers.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user && (
              <Button 
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={() => setShowModal(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Share Your Experience
              </Button>
            )}
          </div>
        </div>

        {/* Google Review CTA Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-2xl p-8 mb-16 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-serif font-semibold mb-2">Love our service?</h3>
              <p className="text-emerald-100 mb-6">Help others discover us by leaving a Google review!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold px-6 py-2.5 rounded-lg shadow-md transition-transform hover:scale-105"
                  onClick={handleGoogleReview}
                >
                  <Star className="w-4 h-4 mr-2 fill-current" />
                  Leave Google Review
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="ghost"
                  className="text-white border border-white/50 hover:bg-white/10 px-6 py-2.5 rounded-lg transition-colors"
                  onClick={() => setShowGoogleQR(true)}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan QR Code
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center">
                <Star className="w-14 h-14 text-yellow-300 fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-gray-500 mt-4">Loading reviews...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-red-50 text-red-600 rounded-lg">{error}</div>
        )}

        {/* Empty State */}
        {!loading && !error && reviews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Be the first to share your experience!</p>
            <Button 
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg shadow-md"
              onClick={() => setShowModal(true)}
            >
              <Star className="w-4 h-4 mr-2" />
              Leave a Review
            </Button>
          </div>
        )}

        {/* Reviews Carousel */}
        {!loading && !error && reviews.length > 0 && (
          <div className="relative">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, A11y, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{ prevEl: ".swiper-button-prev-custom", nextEl: ".swiper-button-next-custom" }}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              loop={true}
              breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="pb-16"
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
            >
              {reviews.map((review, idx) => (
                <SwiperSlide key={review._id || idx} className="h-full">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full border border-gray-100 group flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <Quote className="w-10 h-10 text-emerald-600/15 group-hover:text-emerald-600/30 transition-colors" />
                      {renderStars(review.reviewValue)}
                    </div>
                    <div className="mb-6 flex-1">
                      <p className="text-gray-700 text-base leading-relaxed line-clamp-4">"{review.reviewMessage}"</p>
                    </div>
                    <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                      <div className="w-12 h-12 bg-emerald-600/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-emerald-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.userName || "Anonymous"}</p>
                        <p className="text-xs text-gray-500">Verified Customer</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom Navigation */}
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        {/* Add Review Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-semibold">Share Your Experience</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Your Rating <span className="text-red-500">*</span></label>
                <StarRating rating={form.rating} handleRatingChange={(val) => handleFormChange("rating", val)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Your Review <span className="text-red-500">*</span></label>
                <Textarea value={form.text} onChange={(e) => handleFormChange("text", e.target.value)} maxLength={500} rows={4} placeholder="What did you love? Any suggestions?" className="resize-none" required />
                <div className="text-xs text-gray-400 text-right mt-1">{form.text.length}/500</div>
              </div>
              {formError && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{formError}</div>}
              <div className="bg-emerald-50 border-l-4 border-emerald-300 rounded-r-lg p-4">
                <p className="text-sm text-emerald-800 mb-2">Consider leaving a Google review too—it helps us a lot!</p>
                <Button type="button" variant="outline" size="sm" className="border-emerald-600 text-emerald-700 hover:bg-emerald-100" onClick={handleGoogleReview}>
                  <ExternalLink className="w-3 h-3 mr-2" /> Google Review
                </Button>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Google QR Code Modal */}
        <Dialog open={showGoogleQR} onOpenChange={setShowGoogleQR}>
          <DialogContent className="max-w-xs w-full">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif font-semibold text-center">Review on Google</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4 pt-2">
              <div className="bg-gray-50 p-4 rounded-lg inline-block">
                <img src={googleReviewQr} alt="Google Review QR Code" className="w-48 h-48 mx-auto rounded-lg shadow-sm" />
              </div>
              <p className="text-sm text-gray-600">Scan this code with your phone's camera to leave a review.</p>
              <div className="flex flex-col gap-2">
                <Button onClick={handleGoogleReview} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" /> Open Google Reviews
                </Button>
                <Button variant="outline" onClick={() => setShowGoogleQR(false)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
