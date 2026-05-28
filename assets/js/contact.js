(function () {
  'use strict';

  // DOM Elements
  const form = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  const submitBtn = form?.querySelector('button[type="submit"]');
  if (!form) return;

  // Validation rules
  const validators = {
    name: (value) => {
      const trimmed = value.trim();
      if (trimmed.length < 2) return 'Le nom doit contenir au moins 2 caractères';
      if (trimmed.length > 100) return 'Le nom ne peut pas dépasser 100 caractères';
      if (!/^[a-zA-Z\s\-àâäæçéèêëïîôùûüœÀÂÄÆÇÉÈÊËÏÎÔÙÛÜŒ]+$/.test(trimmed)) {
        return 'Le nom ne doit contenir que des lettres';
      }
      return null;
    },
    email: (value) => {
      const email = value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return 'Adresse e-mail invalide';
      return null;
    },
    phone: (value) => {
      if (!value) return null; // Phone is optional
      const trimmed = value.trim();
      if (!/^[\d\s\-\+\(\)\.]+$/.test(trimmed)) return 'Format de téléphone invalide';
      return null;
    },
    subject: (value) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) return 'L\'objet est requis';
      if (trimmed.length > 200) return 'L\'objet ne peut pas dépasser 200 caractères';
      return null;
    },
    message: (value) => {
      const trimmed = value.trim();
      if (trimmed.length < 5) return 'Le message doit contenir au moins 5 caractères';
      if (trimmed.length > 2000) return 'Le message ne peut pas dépasser 2000 caractères';
      return null;
    }
  };

  // Validate field
  function validateField(name, value) {
    const validator = validators[name];
    if (validator) {
      return validator(value);
    }
    return null;
  }

  // Validate entire form
  function validateForm() {
    const formData = new FormData(form);
    const errors = {};

    for (const [name, value] of formData.entries()) {
      const error = validateField(name, value);
      if (error) {
        errors[name] = error;
      }
    }

    return errors;
  }

  // Show field error
  function showFieldError(fieldName, errorMessage) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    field.classList.add('error');
    const errorEl = field.parentElement?.querySelector('.field-error') || document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = errorMessage;

    if (!field.parentElement?.querySelector('.field-error')) {
      field.parentElement?.appendChild(errorEl);
    }
  }

  // Clear field error
  function clearFieldError(fieldName) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    field.classList.remove('error');
    const errorEl = field.parentElement?.querySelector('.field-error');
    if (errorEl) {
      errorEl.remove();
    }
  }

  // Real-time validation on change
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', function() {
      clearFieldError(this.name);
      const error = validateField(this.name, this.value);
      if (error) {
        showFieldError(this.name, error);
      }
    });

    field.addEventListener('input', function() {
      clearFieldError(this.name);
    });
  });

  // Form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    
    // Validate before submission
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      for (const [fieldName, errorMessage] of Object.entries(errors)) {
        showFieldError(fieldName, errorMessage);
      }
      showMessage('Veuillez corriger les erreurs du formulaire.', 'error');
      return;
    }

    // Clear any previous errors
    form.querySelectorAll('input, textarea').forEach(field => {
      clearFieldError(field.name);
    });
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        showMessage(result.message || 'Message envoyé avec succès!', 'success');
        form.reset();
        // Regenerate CSRF token after successful submission
        if (csrfTokenInput) {
          csrfTokenInput.value = generateCSRFToken();
        }
      } else {
        // Handle specific HTTP error codes
        if (response.status === 429) {
          showMessage('Trop de requêtes. Veuillez attendre avant de rééssayer.', 'error');
        } else if (response.status === 503) {
          showMessage('Erreur serveur. Contactez-nous sur WhatsApp.', 'error');
        } else {
          showMessage(result.message || 'Une erreur est survenue.', 'error');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage('Une erreur réseau est survenue. Contactez-nous sur WhatsApp.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = TRANSLATIONS?.[window.getLang?.() ?? 'fr']?.['form.submit'] || 'Envoyer le message →';
      }
    }
  });

  function showMessage(message, type) {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    formMessage.setAttribute('role', 'alert');

    // Auto-hide after 5 seconds (success only)
    if (type === 'success') {
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    }
  }

})();
