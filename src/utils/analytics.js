// src/utils/analytics.js
// Add Google Analytics
export const initGA = () => {
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!GA_MEASUREMENT_ID) {
    console.log('GA not initialized - no measurement ID');
    return;
  }
  
  // Check if already loaded
  if (typeof window.gtag !== 'undefined') {
    return;
  }
  
  // Load Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
  
  console.log('GA initialized');
};

export const trackPageView = (path) => {
  if (typeof window.gtag !== 'undefined' && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

export const trackEvent = (action, category, label, value) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
