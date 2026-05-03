import { useContentStore } from "../../store/contentStore.js";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

export default function LivePreview({ page, onEditField }) {
  const isLoading = useContentStore((s) => s.isLoading);
  const iframeRef = useRef(null);
  const [deviceMode, setDeviceMode] = useState("desktop"); // desktop, tablet, mobile

  useEffect(() => {
    // Listen for messages from iframe
    const handleMessage = (event) => {
      if (event.data.type === 'EDIT_CONTENT') {
        if (onEditField) {
          onEditField(event.data.key);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEditField]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading preview...</p>
        </div>
      </div>
    );
  }

  // Use iframe to show actual page
  const iframeUrl = page === "home" ? "/" : `/${page}`;

  // Device dimensions - Most popular resolutions in 2026
  const deviceDimensions = {
    desktop: { width: "1920px", height: "1080px", scale: 1 }, // Full HD - most common desktop
    tablet: { width: "820px", height: "1180px", scale: 0.8 }, // iPad Air/Pro portrait (common 2026 tablet)
    mobile: { width: "393px", height: "844px", scale: 1 } // iPhone viewport
  };

  const currentDimensions = deviceDimensions[deviceMode];

  // Construct URL with viewport hint
  const getIframeUrl = () => {
    const baseUrl = page === "home" ? "/" : `/${page}`;
    // Add a query parameter to help the page detect device mode
    return `${baseUrl}?preview=${deviceMode}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-primary overflow-hidden">
      {/* Device Selector */}
      <div className="flex items-center justify-center gap-2 p-3 border-b border-white/10 bg-primary-light">
        <button
          onClick={() => setDeviceMode("desktop")}
          className={`p-2 rounded-lg transition-all ${
            deviceMode === "desktop"
              ? "bg-accent text-white"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
          }`}
          title="Desktop"
        >
          <Icon icon="mdi:monitor" className="w-5 h-5" />
        </button>
        <button
          onClick={() => setDeviceMode("tablet")}
          className={`p-2 rounded-lg transition-all ${
            deviceMode === "tablet"
              ? "bg-accent text-white"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
          }`}
          title="Tablet"
        >
          <Icon icon="mdi:tablet" className="w-5 h-5" />
        </button>
        <button
          onClick={() => setDeviceMode("mobile")}
          className={`p-2 rounded-lg transition-all ${
            deviceMode === "mobile"
              ? "bg-accent text-white"
              : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
          }`}
          title="Mobile"
        >
          <Icon icon="mdi:cellphone" className="w-5 h-5" />
        </button>
      </div>

      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-900 p-4">
        <div
          className="bg-white transition-all duration-300 shadow-2xl overflow-hidden rounded-lg"
          style={{
            width: currentDimensions.width,
            height: currentDimensions.height,
            maxWidth: "100%",
            maxHeight: "100%",
            transform: `scale(${currentDimensions.scale})`
          }}
        >
          <iframe
            ref={iframeRef}
            src={getIframeUrl()}
            className="w-full h-full border-0"
            style={{
              width: currentDimensions.width,
              height: currentDimensions.height
            }}
            title="Live Preview"
            key={`${iframeUrl}-${deviceMode}`}
          />
        </div>
      </div>
    </div>
  );
}
