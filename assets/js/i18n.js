(function () {
  'use strict';

  // Current language — read from localStorage or default FR
  let currentLang = localStorage.getItem('danetudes_lang') || 'fr';

  // Apply language to the entire document
  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('danetudes_lang', lang);

    // Set lang attribute on <html>
    document.documentElement.lang = lang === 'en' ? 'en' : 'fr';

    // Set data-lang on <html> for CSS active state
    document.documentElement.setAttribute('data-lang', lang);

    // Safe HTML parser for trusted localized tags (<br>, <em>) to mitigate XSS
    function setSafeInnerHTML(element, htmlString) {
      element.textContent = '';
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const allowedTags = ['BR', 'EM', 'STRONG'];
      
      function appendSanitized(src, dest) {
        src.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            dest.appendChild(document.createTextNode(node.textContent));
          } else if (node.nodeType === Node.ELEMENT_NODE && allowedTags.includes(node.tagName)) {
            const newEl = document.createElement(node.tagName.toLowerCase());
            appendSanitized(node, newEl);
            dest.appendChild(newEl);
          }
        });
      }
      appendSanitized(doc.body, element);
    }

    // Translate all [data-i18n] elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = window.TRANSLATIONS?.[lang]?.[key];
      if (!text) return;

      // innerHTML for keys that contain HTML tags
      // (hero.h1 contains <br> and <em>)
      const htmlKeys = ['hero.h1'];
      if (htmlKeys.includes(key)) {
        setSafeInnerHTML(el, text);
      } else {
        el.textContent = text;
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = window.TRANSLATIONS?.[lang]?.[key];
      if (text) el.placeholder = text;
    });

    // Update <html lang> for screen readers
    document.documentElement.lang = lang;

    // Update WA messages language if applicable
    if (typeof updateWALang === 'function') updateWALang(lang);

    // Update Calendar language if applicable
    if (typeof updateCalendarLang === 'function') updateCalendarLang(lang);

    // Update Quiz language if applicable
    if (typeof updateQuizLang === 'function') updateQuizLang(lang);
  }

  // Toggle between FR and EN
  function toggleLang() {
    applyLang(currentLang === 'fr' ? 'en' : 'fr');
  }

  // Bind toggle button
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.addEventListener('click', toggleLang);

  // Bind mobile toggle button
  const btnMobile = document.getElementById('lang-toggle-mobile');
  if (btnMobile) btnMobile.addEventListener('click', toggleLang);

  // Apply on page load
  document.addEventListener('DOMContentLoaded', () => {
    applyLang(currentLang);
  });

  // Expose for external use
  window.setLang = applyLang;
  window.getLang = () => currentLang;

})();
