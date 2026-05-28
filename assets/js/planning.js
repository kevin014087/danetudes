// Planning / Calendar JavaScript — DANETUDES
// Extrait de contact.html pour séparer le code de la structure HTML

(function () {
  'use strict';

  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;

  // ── Initialisation ──────────────────────────────────────────────────────────
  function initCalendar() {
    populateYearSelect();
    populateMonthSelect();
    renderCalendar();
    initTimeSlots();
    initReservationForm();
  }

  // ── Sélecteurs année / mois ─────────────────────────────────────────────────
  function populateYearSelect() {
    const yearSelect = document.getElementById('year-select');
    if (!yearSelect) return;
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year <= currentYear + 2; year++) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;
  }

  function populateMonthSelect() {
    const monthSelect = document.getElementById('month-select');
    if (!monthSelect) return;
    monthSelect.value = new Date().getMonth();
  }

  // ── Changement de mois/année ────────────────────────────────────────────────
  window.changeMonth = function () {
    const monthSelect = document.getElementById('month-select');
    const yearSelect  = document.getElementById('year-select');
    currentDate.setMonth(parseInt(monthSelect.value));
    currentDate.setFullYear(parseInt(yearSelect.value));
    renderCalendar();
  };

  window.changeYear = function () {
    window.changeMonth();
  };

  window.previousMonth = function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateSelects();
    renderCalendar();
  };

  window.nextMonth = function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateSelects();
    renderCalendar();
  };

  function updateSelects() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect  = document.getElementById('year-select');
    if (monthSelect) monthSelect.value = currentDate.getMonth();
    if (yearSelect)  yearSelect.value  = currentDate.getFullYear();
  }

  // ── Rendu du calendrier ─────────────────────────────────────────────────────
  function renderCalendar() {
    const year      = currentDate.getFullYear();
    const month     = currentDate.getMonth();
    const firstDay  = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lang      = window.getLang ? window.getLang() : 'fr';

    const monthNamesEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthNamesFr = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const monthNames = lang === 'en' ? monthNamesEn : monthNamesFr;

    const monthEl = document.getElementById('current-month');
    if (monthEl) monthEl.textContent = `${monthNames[month]} ${year}`;

    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    calendarGrid.textContent = '';

    // En-têtes de jours
    const daysOfWeek = lang === 'en' 
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    daysOfWeek.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'calendar-day-header';
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });

    // Cellules vides avant le premier jour
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day other-month';
      calendarGrid.appendChild(emptyDay);
    }

    // Jours du mois
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = day;

      if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
        dayElement.classList.add('today');
      }

      // Disponible uniquement en semaine et à partir d'aujourd'hui
      const dayDate   = new Date(year, month, day);
      const dayOfWeek = dayDate.getDay();
      const isPast    = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isPast) {
        dayElement.classList.add('available');
        dayElement.addEventListener('click', () => selectDate(year, month, day));
      } else {
        dayElement.classList.add('unavailable');
      }

      calendarGrid.appendChild(dayElement);
    }
  }

  // ── Sélection d'une date ────────────────────────────────────────────────────
  function selectDate(year, month, day) {
    document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));

    const dayElements = document.querySelectorAll('.calendar-day:not(.other-month)');
    const dayIndex    = day - 1;
    if (dayElements[dayIndex]) dayElements[dayIndex].classList.add('selected');

    selectedDate = new Date(year, month, day);
    updateSelectedDate();
    showBookingForm();
  }

  function updateSelectedDate() {
    if (!selectedDate) return;
    const lang     = window.getLang ? window.getLang() : 'fr';
    const options  = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr  = selectedDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', options);
    const selEl    = document.getElementById('selected-date');
    const sumEl    = document.getElementById('summary-date');
    if (selEl) selEl.textContent = dateStr;
    if (sumEl) sumEl.textContent = dateStr;
  }

  // ── Créneaux horaires ───────────────────────────────────────────────────────
  function initTimeSlots() {
    document.querySelectorAll('.time-slot:not(.unavailable)').forEach(slot => {
      slot.addEventListener('click', function () {
        document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
        this.classList.add('selected');
        selectedTime = this.dataset.time;
        const sumTime = document.getElementById('summary-time');
        if (sumTime) sumTime.textContent = selectedTime;
      });
    });
  }

  // ── Affichage formulaire de réservation ─────────────────────────────────────
  function showBookingForm() {
    const form = document.getElementById('booking-form');
    if (form) form.style.display = 'block';
  }

  window.cancelBooking = function () {
    const form = document.getElementById('booking-form');
    if (form) form.style.display = 'none';
    document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
    selectedDate = null;
    selectedTime = null;
    const resForm = document.getElementById('reservation-form');
    if (resForm) resForm.reset();
  };

  // ── Soumission de la réservation via WhatsApp ───────────────────────────────
  function initReservationForm() {
    const resForm = document.getElementById('reservation-form');
    if (!resForm) return;

    resForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const lang = window.getLang ? window.getLang() : 'fr';

      if (!selectedDate || !selectedTime) {
        const alertMsg = lang === 'en'
          ? 'Please select a date and a time slot.'
          : 'Veuillez sélectionner une date et un créneau horaire.';
        alert(alertMsg);
        return;
      }

      const formData = new FormData(this);
      const name     = formData.get('name')    || '';
      const email    = formData.get('email')   || '';
      const phone    = formData.get('phone')   || '';
      const course   = formData.get('course')  || '';
      const message  = formData.get('message') || '';
      const dateStr  = selectedDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      const waMsg = lang === 'en' ? [
        '📅 *New Booking DANETUDES*',
        '',
        `👤 Name: ${name}`,
        `📧 Email: ${email}`,
        `📞 Tel: ${phone}`,
        `📆 Date: ${dateStr}`,
        `🕐 Time: ${selectedTime}`,
        `📚 Course: ${course}`,
        message ? `💬 Message: ${message}` : ''
      ].filter(Boolean).join('\n') : [
        '📅 *Nouvelle réservation DANETUDES*',
        '',
        `👤 Nom : ${name}`,
        `📧 Email : ${email}`,
        `📞 Tél : ${phone}`,
        `📆 Date : ${dateStr}`,
        `🕐 Heure : ${selectedTime}`,
        `📚 Cours : ${course}`,
        message ? `💬 Message : ${message}` : ''
      ].filter(Boolean).join('\n');

      const waUrl = `https://wa.me/22589767600?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Feedback utilisateur
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.textContent = lang === 'en' ? '✓ Booking sent!' : '✓ Réservation envoyée !';
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.textContent = lang === 'en' ? 'Confirm booking' : 'Confirmer la réservation';
          submitBtn.disabled = false;
        }, 3000);
      }

      window.cancelBooking();
    });
  }

  // Hook externe de changement de langue
  window.updateCalendarLang = function (lang) {
    renderCalendar();
    updateSelectedDate();
  };

  // ── Lancement ───────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', initCalendar);

})();
