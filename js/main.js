/**
 * Eventify — Main Application Script
 * Initializes shared navigation/footer layout and routes behavior
 * to the active page based on the body[data-page] attribute.
 */

import { EVENTS, EVENT_CATEGORIES, getEventById } from './data.js';
import {
  getRegistrations,
  getRegistrationCountForEvent,
  isDuplicateRegistration,
  removeRegistration,
  saveContactMessage,
  saveRegistration
} from './storage.js';
import {
  attachImageFallbacks,
  clearFieldError,
  createEmptyState,
  createEventCard,
  escapeHtml,
  formatDate,
  initLayout,
  setFieldError,
  validateEmail,
  validatePhone
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || 'home';

  // Map sub-pages like event-details or register to their parent nav highlight where appropriate
  const navHighlightMap = {
    home: 'home',
    events: 'events',
    'event-details': 'events',
    register: 'register',
    about: 'about',
    contact: 'contact',
    'my-registrations': 'registrations'
  };

  initLayout(navHighlightMap[page] || '');
  attachImageFallbacks(document);

  switch (page) {
    case 'home':
      initHomePage();
      break;
    case 'events':
      initEventsPage();
      break;
    case 'event-details':
      initEventDetailsPage();
      break;
    case 'register':
      initRegistrationPage();
      break;
    case 'contact':
      initContactPage();
      break;
    case 'my-registrations':
      initMyRegistrationsPage();
      break;
    default:
      break;
  }
});

/* --------------------------------------------------------------------------
   Home Page: Featured Events & Upcoming Schedule
   -------------------------------------------------------------------------- */
function initHomePage() {
  const featuredContainer = document.getElementById('featured-events-grid');
  const upcomingContainer = document.getElementById('upcoming-events-list');

  if (featuredContainer) {
    const featuredEvents = EVENTS.filter((event) => event.featured).slice(0, 2);
    featuredContainer.innerHTML = featuredEvents.map(createEventCard).join('');
    attachImageFallbacks(featuredContainer);
  }

  if (upcomingContainer) {
    const upcomingEvents = EVENTS.filter((event) => event.upcoming).slice(0, 4);
    if (upcomingEvents.length === 0) {
      upcomingContainer.innerHTML = createEmptyState({
        title: 'No upcoming events scheduled',
        description: 'Check back soon for the next semester calendar.',
        actionText: 'Browse Archive',
        actionHref: 'events.html'
      });
      return;
    }

    upcomingContainer.innerHTML = upcomingEvents
      .map((event) => {
        return `
          <article class="upcoming-row">
            <div>
              <div class="upcoming-row__date tabular-nums">${escapeHtml(formatDate(event.date))}</div>
              <div class="upcoming-row__time tabular-nums">${escapeHtml(event.time)}</div>
            </div>

            <div>
              <h3 class="upcoming-row__title">
                <a href="event-details.html?id=${encodeURIComponent(event.id)}">
                  ${escapeHtml(event.title)}
                </a>
              </h3>
              <div class="upcoming-row__meta">
                <span>${escapeHtml(event.category)}</span>
                <span aria-hidden="true">&middot;</span>
                <span>${escapeHtml(event.location)}</span>
              </div>
            </div>

            <div>
              <a href="event-details.html?id=${encodeURIComponent(event.id)}" class="btn btn--secondary">
                Details
              </a>
            </div>
          </article>
        `;
      })
      .join('');
  }
}

/* --------------------------------------------------------------------------
   Events Page: Category Filtering & Live Search
   -------------------------------------------------------------------------- */
function initEventsPage() {
  const filterTabsContainer = document.getElementById('category-tabs');
  const searchInput = document.getElementById('event-search-input');
  const eventsGrid = document.getElementById('all-events-grid');
  const resultsSummary = document.getElementById('results-summary');

  if (!filterTabsContainer || !eventsGrid || !searchInput) return;

  let activeCategory = 'All';
  let searchQuery = '';

  // Allow deep-linking via ?category=Workshop
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get('category');
  if (initialCategory && EVENT_CATEGORIES.includes(initialCategory)) {
    activeCategory = initialCategory;
  }

  // Render category filter buttons
  filterTabsContainer.innerHTML = EVENT_CATEGORIES.map((category) => {
    const isPressed = category === activeCategory ? 'true' : 'false';
    return `
      <button
        type="button"
        class="category-tab"
        data-category="${escapeHtml(category)}"
        aria-pressed="${isPressed}"
      >
        ${escapeHtml(category)}
      </button>
    `;
  }).join('');

  function renderFilteredEvents() {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const matched = EVENTS.filter((event) => {
      const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
      const matchesSearch =
        normalizedQuery === '' ||
        event.title.toLowerCase().includes(normalizedQuery) ||
        event.location.toLowerCase().includes(normalizedQuery) ||
        event.summary.toLowerCase().includes(normalizedQuery) ||
        event.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });

    if (resultsSummary) {
      const label = matched.length === 1 ? 'event' : 'events';
      const categoryText = activeCategory === 'All' ? 'all categories' : activeCategory;
      resultsSummary.textContent = `Showing ${matched.length} ${label} in ${categoryText}`;
    }

    if (matched.length === 0) {
      eventsGrid.className = '';
      eventsGrid.innerHTML = createEmptyState({
        title: 'No matching events found',
        description:
          'Try adjusting your search keywords or switching back to all event categories.',
        actionText: 'Reset Filters',
        buttonId: 'reset-filters-btn'
      });

      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeCategory = 'All';
          searchQuery = '';
          searchInput.value = '';
          updateTabPressedStates();
          renderFilteredEvents();
          searchInput.focus();
        });
      }
      return;
    }

    eventsGrid.className = 'events-grid';
    eventsGrid.innerHTML = matched.map(createEventCard).join('');
    attachImageFallbacks(eventsGrid);
  }

  function updateTabPressedStates() {
    const tabButtons = filterTabsContainer.querySelectorAll('.category-tab');
    tabButtons.forEach((btn) => {
      const isSelected = btn.dataset.category === activeCategory;
      btn.setAttribute('aria-pressed', String(isSelected));
    });
  }

  filterTabsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.category-tab');
    if (!button) return;
    activeCategory = button.dataset.category || 'All';
    updateTabPressedStates();
    renderFilteredEvents();
  });

  searchInput.addEventListener('input', (event) => {
    searchQuery = event.target.value;
    renderFilteredEvents();
  });

  renderFilteredEvents();
}

/* --------------------------------------------------------------------------
   Event Details Page: Dynamic Event View by Query String (?id=...)
   -------------------------------------------------------------------------- */
function initEventDetailsPage() {
  const container = document.getElementById('event-detail-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('id');
  const event = getEventById(eventId);

  if (!event) {
    document.title = 'Event Not Found — Eventify';
    container.innerHTML = createEmptyState({
      title: 'Event could not be found',
      description:
        'The event you requested may have ended or the link may be incomplete. Browse our full event directory to find upcoming sessions.',
      actionText: 'Browse All Events',
      actionHref: 'events.html'
    });
    return;
  }

  document.title = `${event.title} — Eventify`;

  const registeredCount = getRegistrationCountForEvent(event.id);
  const formattedDate = formatDate(event.date);

  const descriptionParagraphs = event.description
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('');

  const agendaItems = event.agenda
    .map(
      (slot) => `
      <li>
        <span class="detail-agenda__time tabular-nums">${escapeHtml(slot.time)}</span>
        <span>${escapeHtml(slot.item)}</span>
      </li>
    `
    )
    .join('');

  container.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="events.html">Events</a>
      <span aria-hidden="true"> / </span>
      <span>${escapeHtml(event.category)}</span>
    </nav>

    <div class="detail-layout">
      <div>
        <div class="event-meta">
          <span class="event-meta__category">${escapeHtml(event.category)}</span>
          <span aria-hidden="true">&middot;</span>
          <time datetime="${escapeHtml(event.date)}" class="tabular-nums">${escapeHtml(formattedDate)}</time>
        </div>

        <h1 class="editorial-heading page-header__title">${escapeHtml(event.title)}</h1>

        <div class="detail-hero-img media-frame">
          <img
            src="${escapeHtml(event.image)}"
            alt="${escapeHtml(event.imageAlt)}"
            referrerpolicy="no-referrer"
          />
          <div class="media-frame__fallback">
            <span>${escapeHtml(event.title)}</span>
          </div>
        </div>

        <div class="detail-prose">
          <h2>About this event</h2>
          ${descriptionParagraphs}

          <h2>Schedule highlights</h2>
          <ul class="detail-agenda">
            ${agendaItems}
          </ul>
        </div>
      </div>

      <aside class="detail-sidebar" aria-label="Event logistics and registration">
        <h2 class="detail-sidebar__title">Event Information</h2>
        <dl class="detail-facts">
          <div class="detail-facts__row">
            <dt>Date</dt>
            <dd class="tabular-nums">${escapeHtml(formattedDate)}</dd>
          </div>
          <div class="detail-facts__row">
            <dt>Time</dt>
            <dd class="tabular-nums">${escapeHtml(event.time)}</dd>
          </div>
          <div class="detail-facts__row">
            <dt>Location</dt>
            <dd>${escapeHtml(event.location)}</dd>
          </div>
          <div class="detail-facts__row">
            <dt>Organizer</dt>
            <dd>${escapeHtml(event.organizer)}</dd>
          </div>
          <div class="detail-facts__row">
            <dt>Capacity</dt>
            <dd class="tabular-nums">${event.capacity} seats</dd>
          </div>
          <div class="detail-facts__row">
            <dt>Your local passes</dt>
            <dd class="tabular-nums">${registeredCount}</dd>
          </div>
        </dl>

        <a href="register.html?event=${encodeURIComponent(event.id)}" class="btn btn--primary">
          Register for This Event
        </a>
        <p class="field-hint" style="margin-top: 12px; text-align: center;">
          Free admission for students and campus guests.
        </p>
      </aside>
    </div>
  `;

  attachImageFallbacks(container);
}

/* --------------------------------------------------------------------------
   Registration Page: Form Validation & LocalStorage Persistence
   -------------------------------------------------------------------------- */
function initRegistrationPage() {
  const form = document.getElementById('registration-form');
  const eventSelect = document.getElementById('reg-event');
  const feedbackBox = document.getElementById('registration-feedback');
  const previewBox = document.getElementById('selected-event-preview');

  if (!form || !eventSelect) return;

  // Populate select options dynamically from EVENTS
  eventSelect.innerHTML = [
    '<option value="">Select an upcoming event...</option>',
    ...EVENTS.map(
      (event) =>
        `<option value="${escapeHtml(event.id)}">${escapeHtml(event.title)} (${escapeHtml(
          formatDate(event.date)
        )})</option>`
    )
  ].join('');

  // Pre-select event if passed in URL (?event=...)
  const params = new URLSearchParams(window.location.search);
  const preselectedId = params.get('event');
  if (preselectedId && getEventById(preselectedId)) {
    eventSelect.value = preselectedId;
  }

  function updateSelectedEventPreview() {
    if (!previewBox) return;
    const selected = getEventById(eventSelect.value);
    if (!selected) {
      previewBox.innerHTML = `
        <h2 class="info-panel__title">Registration Guide</h2>
        <p class="field-hint" style="font-size: 0.9375rem;">
          Select an event from the dropdown to see its schedule and venue details before submitting your pass.
        </p>
        <ul class="info-panel__list">
          <li>
            <span class="info-panel__label">Instant Confirmation</span>
            Passes are saved directly in your browser under My Registrations.
          </li>
          <li>
            <span class="info-panel__label">No Hidden Fees</span>
            All listed campus talks, workshops, and showcases are free to attend.
          </li>
        </ul>
      `;
      return;
    }

    previewBox.innerHTML = `
      <h2 class="info-panel__title">${escapeHtml(selected.title)}</h2>
      <p style="font-size: 0.9375rem; color: var(--color-ink-muted);">
        ${escapeHtml(selected.summary)}
      </p>
      <ul class="info-panel__list">
        <li>
          <span class="info-panel__label">Date &amp; Time</span>
          <span class="tabular-nums">${escapeHtml(formatDate(selected.date))} &middot; ${escapeHtml(selected.time)}</span>
        </li>
        <li>
          <span class="info-panel__label">Location</span>
          ${escapeHtml(selected.location)}
        </li>
        <li>
          <span class="info-panel__label">Organizer</span>
          ${escapeHtml(selected.organizer)}
        </li>
      </ul>
    `;
  }

  eventSelect.addEventListener('change', updateSelectedEventPreview);
  updateSelectedEventPreview();

  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const phoneInput = document.getElementById('reg-phone');
  const notesInput = document.getElementById('reg-notes');

  const nameError = document.getElementById('reg-name-error');
  const emailError = document.getElementById('reg-email-error');
  const phoneError = document.getElementById('reg-phone-error');
  const eventError = document.getElementById('reg-event-error');

  // Clear field errors on user input
  [
    [nameInput, nameError],
    [emailInput, emailError],
    [phoneInput, phoneError],
    [eventSelect, eventError]
  ].forEach(([input, errorEl]) => {
    if (!input) return;
    input.addEventListener('input', () => clearFieldError(input, errorEl));
    input.addEventListener('change', () => clearFieldError(input, errorEl));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (feedbackBox) feedbackBox.innerHTML = '';

    let isValid = true;
    let firstInvalidField = null;

    // 1. Full Name validation
    const nameValue = nameInput.value.trim();
    if (nameValue.length < 2) {
      setFieldError(nameInput, nameError, 'Please enter your full name (at least 2 characters).');
      isValid = false;
      firstInvalidField = firstInvalidField || nameInput;
    } else {
      clearFieldError(nameInput, nameError);
    }

    // 2. Email validation
    const emailValue = emailInput.value.trim();
    if (!validateEmail(emailValue)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
      firstInvalidField = firstInvalidField || emailInput;
    } else {
      clearFieldError(emailInput, emailError);
    }

    // 3. Phone validation
    const phoneValue = phoneInput.value.trim();
    if (!validatePhone(phoneValue)) {
      setFieldError(
        phoneInput,
        phoneError,
        'Please enter a valid phone number (7 to 15 digits).'
      );
      isValid = false;
      firstInvalidField = firstInvalidField || phoneInput;
    } else {
      clearFieldError(phoneInput, phoneError);
    }

    // 4. Event selection validation
    const selectedEventId = eventSelect.value;
    const selectedEvent = getEventById(selectedEventId);
    if (!selectedEvent) {
      setFieldError(eventSelect, eventError, 'Please choose an event to register for.');
      isValid = false;
      firstInvalidField = firstInvalidField || eventSelect;
    } else {
      clearFieldError(eventSelect, eventError);
    }

    if (!isValid) {
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    // 5. Prevent duplicate registration for the same email + event
    if (isDuplicateRegistration(selectedEventId, emailValue)) {
      if (feedbackBox) {
        feedbackBox.innerHTML = `
          <div class="alert alert--error" role="alert">
            <h2 class="alert__title">Already Registered</h2>
            <p class="alert__body">
              ${escapeHtml(emailValue)} is already registered for
              <strong>${escapeHtml(selectedEvent.title)}</strong>.
            </p>
            <div class="alert__actions">
              <a href="my-registrations.html" class="btn btn--secondary">View My Registrations</a>
            </div>
          </div>
        `;
      }
      return;
    }

    // 6. Save registration to LocalStorage and display confirmation
    const saved = saveRegistration({
      name: nameValue,
      email: emailValue,
      phone: phoneValue,
      eventId: selectedEventId,
      notes: notesInput ? notesInput.value : ''
    });

    form.reset();
    updateSelectedEventPreview();

    if (feedbackBox) {
      feedbackBox.innerHTML = `
        <div class="alert alert--success" role="status" aria-live="polite">
          <h2 class="alert__title">Registration Confirmed (${escapeHtml(saved.referenceCode)})</h2>
          <p class="alert__body">
            Thank you, <strong>${escapeHtml(saved.name)}</strong>. Your seat for
            <strong>${escapeHtml(selectedEvent.title)}</strong> on
            <span class="tabular-nums">${escapeHtml(formatDate(selectedEvent.date))}</span> has been saved.
          </p>
          <div class="alert__actions">
            <a href="my-registrations.html" class="btn btn--primary">View My Registrations</a>
            <a href="events.html" class="btn btn--secondary">Browse More Events</a>
          </div>
        </div>
      `;
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/* --------------------------------------------------------------------------
   Contact Page: Validated Inquiry Form
   -------------------------------------------------------------------------- */
function initContactPage() {
  const form = document.getElementById('contact-form');
  const feedbackBox = document.getElementById('contact-feedback');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const topicSelect = document.getElementById('contact-topic');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('contact-name-error');
  const emailError = document.getElementById('contact-email-error');
  const messageError = document.getElementById('contact-message-error');

  [
    [nameInput, nameError],
    [emailInput, emailError],
    [messageInput, messageError]
  ].forEach(([input, errorEl]) => {
    if (!input) return;
    input.addEventListener('input', () => clearFieldError(input, errorEl));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (feedbackBox) feedbackBox.innerHTML = '';

    let isValid = true;
    let firstInvalidField = null;

    if (nameInput.value.trim().length < 2) {
      setFieldError(nameInput, nameError, 'Please enter your name.');
      isValid = false;
      firstInvalidField = firstInvalidField || nameInput;
    } else {
      clearFieldError(nameInput, nameError);
    }

    if (!validateEmail(emailInput.value)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
      firstInvalidField = firstInvalidField || emailInput;
    } else {
      clearFieldError(emailInput, emailError);
    }

    if (messageInput.value.trim().length < 10) {
      setFieldError(
        messageInput,
        messageError,
        'Please write a message of at least 10 characters.'
      );
      isValid = false;
      firstInvalidField = firstInvalidField || messageInput;
    } else {
      clearFieldError(messageInput, messageError);
    }

    if (!isValid) {
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    const saved = saveContactMessage({
      name: nameInput.value,
      email: emailInput.value,
      topic: topicSelect ? topicSelect.value : 'General Inquiry',
      message: messageInput.value
    });

    form.reset();

    if (feedbackBox) {
      feedbackBox.innerHTML = `
        <div class="alert alert--success" role="status" aria-live="polite">
          <h2 class="alert__title">Message Sent</h2>
          <p class="alert__body">
            Thanks for reaching out, <strong>${escapeHtml(saved.name)}</strong>. Our student event
            coordinators will reply to <strong>${escapeHtml(saved.email)}</strong> within two business days.
          </p>
        </div>
      `;
    }
  });
}

/* --------------------------------------------------------------------------
   My Registrations Page: Display & Cancel Stored Registrations
   -------------------------------------------------------------------------- */
function initMyRegistrationsPage() {
  const listContainer = document.getElementById('registrations-container');
  const countHeading = document.getElementById('registrations-count');
  if (!listContainer) return;

  function renderRegistrations() {
    const registrations = getRegistrations();

    if (countHeading) {
      const label = registrations.length === 1 ? 'registered event' : 'registered events';
      countHeading.textContent = `${registrations.length} ${label} saved in this browser`;
    }

    if (registrations.length === 0) {
      listContainer.innerHTML = createEmptyState({
        title: 'You have no registrations yet',
        description:
          'When you register for a campus talk, workshop, or cultural event, your confirmation pass will appear here.',
        actionText: 'Browse Upcoming Events',
        actionHref: 'events.html'
      });
      return;
    }

    listContainer.innerHTML = `
      <div class="registrations-list">
        ${registrations
          .map((reg) => {
            const event = getEventById(reg.eventId);
            const eventTitle = event ? event.title : 'Campus Event';
            const eventDate = event ? formatDate(event.date) : 'Date TBD';
            const eventTime = event ? event.time : '';
            const eventLocation = event ? event.location : 'Campus Venue';
            const detailLink = event
              ? `<a href="event-details.html?id=${encodeURIComponent(event.id)}" class="btn btn--secondary">Event Details</a>`
              : '';

            return `
              <article class="registration-item" data-reg-id="${escapeHtml(reg.id)}">
                <div>
                  <div class="registration-item__ref tabular-nums">
                    Pass ${escapeHtml(reg.referenceCode)} &middot; Confirmed
                  </div>
                  <h2 class="registration-item__title">${escapeHtml(eventTitle)}</h2>
                  <p class="registration-item__meta tabular-nums">
                    ${escapeHtml(eventDate)}${eventTime ? ` &middot; ${escapeHtml(eventTime)}` : ''} &middot; ${escapeHtml(eventLocation)}
                  </p>
                  <p class="registration-item__attendee">
                    Attendee: <strong>${escapeHtml(reg.name)}</strong> (${escapeHtml(reg.email)} &middot; <span class="tabular-nums">${escapeHtml(reg.phone)}</span>)
                  </p>
                </div>

                <div class="registration-item__actions">
                  ${detailLink}
                  <button
                    type="button"
                    class="btn btn--danger-outline cancel-reg-btn"
                    data-reg-id="${escapeHtml(reg.id)}"
                  >
                    Cancel Registration
                  </button>
                </div>
              </article>
            `;
          })
          .join('')}
      </div>
    `;
  }

  // Handle inline two-step cancellation without browser confirm/alert popups
  listContainer.addEventListener('click', (event) => {
    const cancelBtn = event.target.closest('.cancel-reg-btn');
    if (cancelBtn) {
      const regId = cancelBtn.dataset.regId;
      const actionsWrap = cancelBtn.parentElement;
      if (!actionsWrap || !regId) return;

      actionsWrap.innerHTML = `
        <div class="inline-confirm" role="group" aria-label="Confirm cancellation">
          <span>Remove this pass?</span>
          <button type="button" class="btn btn--danger-outline confirm-cancel-btn" data-reg-id="${escapeHtml(regId)}">
            Yes, Cancel
          </button>
          <button type="button" class="btn btn--secondary keep-reg-btn" style="min-height: 40px; padding: 8px 14px; font-size: 0.875rem;">
            Keep
          </button>
        </div>
      `;
      return;
    }

    const confirmBtn = event.target.closest('.confirm-cancel-btn');
    if (confirmBtn) {
      const regId = confirmBtn.dataset.regId;
      if (regId) {
        removeRegistration(regId);
        renderRegistrations();
      }
      return;
    }

    const keepBtn = event.target.closest('.keep-reg-btn');
    if (keepBtn) {
      renderRegistrations();
    }
  });

  renderRegistrations();
}
