import React, { useState, useEffect } from "react";

/**
 * Extracts the YouTube video ID from any valid YouTube URL.
 * Supports: watch, youtu.be, embed, shorts, live, etc.
 */
function extractYouTubeId(url) {
  if (!url) return null;
  try {
    // Normalize URL
    const parsed = new URL(url);
    
    // youtu.be/<id>
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.slice(1);
      return videoId;
    }
    // youtube.com/embed/<id>
    if (parsed.pathname.startsWith("/embed/")) {
      const videoId = parsed.pathname.split("/embed/")[1].split(/[/?]/)[0];
      return videoId;
    }
    // youtube.com/shorts/<id>
    if (parsed.pathname.startsWith("/shorts/")) {
      const videoId = parsed.pathname.split("/shorts/")[1].split(/[/?]/)[0];
      return videoId;
    }
    // youtube.com/live/<id>
    if (parsed.pathname.startsWith("/live/")) {
      const videoId = parsed.pathname.split("/live/")[1].split(/[/?]/)[0];
      return videoId;
    }
    // youtube.com/watch?v=<id>
    if (parsed.searchParams.has("v")) {
      const videoId = parsed.searchParams.get("v");
      return videoId;
    }
    // youtube.com/v/<id>
    if (parsed.pathname.startsWith("/v/")) {
      const videoId = parsed.pathname.split("/v/")[1].split(/[/?]/)[0];
      return videoId;
    }
    // Fallback: try to extract last path segment
    const parts = parsed.pathname.split("/");
    if (parts.length > 1) {
      const videoId = parts[parts.length - 1];
      return videoId;
    }
      } catch (e) {
      return null;
    }
  return null;
}

const YoutubeEmbed = ({ url, title = "YouTube video" }) => {
  const [videoId, setVideoId] = useState(null);
  const [embedError, setEmbedError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setEmbedError(false);
    setIsLoading(true);
    const extractedVideoId = extractYouTubeId(url);
    setVideoId(extractedVideoId);
    
    if (extractedVideoId) {
      // Video ID extracted successfully
    }
  }, [url]);

  if (!url) return null;

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&disablekb=1&origin=${window.location.origin}`
    : null;

  // Responsive 16:9 aspect ratio
  return (
    <div className="w-full max-w-full">
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-black">
        {embedUrl && !embedError ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
            onError={() => {
              setEmbedError(true);
            }}
            onLoad={() => {
              setIsLoading(false);
            }}
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 text-white flex flex-col items-center justify-center rounded-lg p-6 text-center">
            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">
                Video Unavailable
              </p>
              <p className="text-sm text-gray-300 mb-4">
                This video cannot be embedded or may be private/restricted.
              </p>
              <p className="text-xs text-gray-400 mb-2">
                Video ID: {videoId || "Unknown"}
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 text-white px-5 py-3 rounded-lg text-decoration-none font-bold text-base hover:bg-red-700 transition-colors"
            >
              Watch on YouTube
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeEmbed;
