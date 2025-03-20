import { supabase } from "../supabaseClient";

// Cache key constants
const CACHE_KEYS = {
  BIO_DATA: "bioData",
  IMAGES: "preloadedImages",
};

// Function to preload and cache images
const preloadImage = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

// Function to preload critical fonts
const preloadFont = (url) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "font";
  link.href = url;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
};

// Main preload function
export const preloadResources = async () => {
  try {
    // Fetch bio data and cache it
    const cachedBio = sessionStorage.getItem(CACHE_KEYS.BIO_DATA);
    if (!cachedBio) {
      const { data: bioData } = await supabase.from("bio").select("*").single();

      if (bioData) {
        sessionStorage.setItem(CACHE_KEYS.BIO_DATA, JSON.stringify(bioData));

        // Preload hero image if available
        if (bioData.Image) {
          await preloadImage(bioData.Image);
        }
      }
    }

    // Preload critical fonts
    const fonts = [
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
    ];
    fonts.forEach(preloadFont);

    // Add performance marks
    performance.mark("resourcesPreloaded");
  } catch (error) {
    console.error("Error preloading resources:", error);
  }
};

// Function to clear cache
export const clearResourceCache = () => {
  Object.values(CACHE_KEYS).forEach((key) => {
    sessionStorage.removeItem(key);
  });
};

// Function to measure performance
export const measurePerformance = () => {
  if (performance.getEntriesByType) {
    const timing = performance.getEntriesByType("navigation")[0];
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page load time: ${loadTime}ms`);
  }
};
