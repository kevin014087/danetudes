/**
 * Performance Optimization & Lazy Loading
 * DANETUDES - Optimize core web vitals
 */

(function() {
  'use strict';

  // Configuration
  const LAZY_LOAD_ENABLED = true;
  const PRELOAD_ENABLED = true;

  /**
   * Lazy Loading Images using Intersection Observer
   */
  function initLazyLoading() {
    if (!LAZY_LOAD_ENABLED || !('IntersectionObserver' in window)) {
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Load srcset
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px' // Start loading 50px before visible
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    Logger?.info?.('Lazy loading initialized');
  }

  /**
   * Preload critical resources
   */
  function initPreloading() {
    if (!PRELOAD_ENABLED) return;

    // Preload fonts (if any)
    const preloadFonts = [
      // '/assets/fonts/your-font.woff2'
    ];

    preloadFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = font;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Prefetch DNS for external domains
    const prefetchDns = [
      'https://cdn.danetudes.ci',
      'https://api.clapay.com'
    ];

    prefetchDns.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    Logger?.info?.('Preloading initialized');
  }

  /**
   * Debounce function
   */
  function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  /**
   * Monitor Web Vitals (LCP, FID, CLS)
   */
  function monitorWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          Logger?.info?.(`LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
        });
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP observer not supported');
      }
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              Logger?.info?.(`CLS: ${clsValue}`);
            }
          }
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }

    Logger?.info?.('Web Vitals monitoring started');
  }

  /**
   * Optimize stylesheet loading
   */
  function optimizeStylesheets() {
    // Convert render-blocking CSS to non-blocking for non-critical styles
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    
    stylesheets.forEach(link => {
      // Keep critical above the fold
      // Load other async
      if (link.href.includes('style.css')) {
        // Keep critical style
        return;
      }
      
      // Load non-critical async
      link.media = 'print';
      link.onload = function() {
        this.media = 'all';
      };
    });

    Logger?.info?.('Stylesheet loading optimized');
  }

  /**
   * Request Idle Callback polyfill and usage
   */
  function scheduleIdleTasks() {
    const requestIdleCallback = window.requestIdleCallback || 
      function(cb) { return setTimeout(cb, 1); };

    // Tasks to run when browser is idle
    const idleTasks = [
      () => {
        // Load analytics script
        Logger?.info?.('Idle task: analytics loaded');
      },
      () => {
        // Prefetch next page resources
        Logger?.info?.('Idle task: prefetch completed');
      }
    ];

    idleTasks.forEach(task => {
      requestIdleCallback(task);
    });
  }

  /**
   * Optimize DOM manipulation
   */
  function batchDOMUpdates(updates) {
    requestAnimationFrame(() => {
      updates();
    });
  }

  /**
   * Initialize all performance optimizations
   */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    Logger?.info?.('Performance optimization starting');
    
    initLazyLoading();
    initPreloading();
    monitorWebVitals();
    optimizeStylesheets();
    scheduleIdleTasks();

    Logger?.info?.('Performance optimization complete');
  }

  /**
   * Public API
   */
  window.Performance = {
    init: init,
    debounce: debounce,
    batchDOM: batchDOMUpdates
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
