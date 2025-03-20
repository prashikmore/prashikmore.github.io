import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { LoadingContainer } from "./components/shared/LoadingContainer";
import { darkTheme } from "./utils/Themes";
import { preloadResources, measurePerformance } from "./utils/performance";

// Initialize performance measurement
performance.mark("bootstrapStart");

// Start preloading resources in parallel with app initialization
const preloadPromise = preloadResources();

// Create root outside of promise to avoid double initialization
const root = ReactDOM.createRoot(document.getElementById("root"));

// Configure error boundary for preloading
const renderApp = async () => {
  try {
    // Wait for critical resources
    await preloadPromise;

    root.render(
      <ThemeProvider theme={darkTheme}>
        <Suspense fallback={<LoadingContainer />}>
          <App />
        </Suspense>
      </ThemeProvider>
    );

    // Mark render completion
    performance.mark("renderComplete");
    performance.measure("totalRenderTime", "bootstrapStart", "renderComplete");

    // Log performance metrics
    measurePerformance();
  } catch (error) {
    console.error("Failed to initialize app:", error);
    // Render fallback UI if preloading fails
    root.render(<LoadingContainer error={true} />);
  }
};

// Start rendering
renderApp();
