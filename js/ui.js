/**
 * Reusable UI Builders, Validation & Formatting Helpers
 * Shared across all Eventify pages to maintain consistent layout and accessibility.
 */

const NAV_ITEMS = [
  { key: 'home', label: 'Home', href: 'index.html' },
  { key: 'events', label: 'Events', href: 'events.html' },
  { key: 'registrations', label: 'Registrations', href: 'my-registrations.html' },
  { key: 'about', label: 'About', href: 'about.html' },
  { key: 'contact', label: 'Contact', href: 'contact.html' }
];

/**
 * Escapes HTML special characters to prevent markup injection from user input.
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
  if (typeof value !== 'string') return '';
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Formats an ISO YYYY-MM-DD date string into a readable editorial format (e.g. "Nov 21, 2026").
 * @param {string} isoDate
 * @returns {string}
 */
export function formatDate(isoDate) {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3) return isoDate;
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Injects the shared 3-zone header, accessible mobile menu drawer, and footer.
 * @param {string} activePageKey
 */
export function initLayout(activePageKey) {
  const headerContainer = document.getElementById('site-header');
  const footerContainer = document.getElementById('site-footer');

  if (headerContainer) {
    const desktopLinks = NAV_ITEMS.map((item) => {
      const currentAttr = item.key === activePageKey ? 'aria-current="page"' : '';
      return `<a href="${item.href}" class="primary-nav__link" ${currentAttr}>${item.label}</a>`;
    }).join('');

    const mobileLinks = NAV_ITEMS.map((item) => {
      const currentAttr = item.key === activePageKey ? 'aria-current="page"' : '';
      return `<a href="${item.href}" class="mobile-drawer__link" ${currentAttr}>${item.label}</a>`;
    }).join('');

    headerContainer.innerHTML = `
      <div class="container site-header__inner">
        <a href="index.html" class="brand-wordmark">Eventify</a>

        <nav class="primary-nav" aria-label="Main navigation">
          ${desktopLinks}
        </nav>

        <div class="header-actions">
          <a href="register.html" class="btn btn--primary header-desktop-cta">Register</a>
          <button
            type="button"
            class="mobile-menu-toggle"
            id="mobile-menu-toggle"
            aria-expanded="false"
            aria-controls="mobile-drawer"
            aria-label="Open navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="mobile-drawer" id="mobile-drawer">
        <nav class="mobile-drawer__nav" aria-label="Mobile navigation">
          ${mobileLinks}
        </nav>
        <a href="register.html" class="btn btn--primary" style="width: 100%;">Register for an Event</a>
      </div>
    `;

    // Wire accessible mobile menu toggle & Escape key behavior
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-drawer');

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
        toggleBtn.setAttribute(
          'aria-label',
          isExpanded ? 'Open navigation menu' : 'Close navigation menu'
        );
        drawer.classList.toggle('is-open', !isExpanded);
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.setAttribute('aria-label', 'Open navigation menu');
          drawer.classList.remove('is-open');
          toggleBtn.focus();
        }
      });
    }
  }

  if (footerContainer) {
    footerContainer.innerHTML = `
      <div class="container">
        <div class="site-footer__grid">
          <div>
            <p class="site-footer__brand">Eventify</p>
            <p class="site-footer__desc">
              A student-built campus and community event directory designed to make discovering
              talks, workshops, and cultural gatherings simple and accessible.
            </p>
          </div>

          <div>
            <h2 class="site-footer__heading">Explore</h2>
            <ul class="site-footer__links">
              <li><a href="index.html">Home</a></li>
              <li><a href="events.html">All Events</a></li>
              <li><a href="register.html">Register</a></li>
              <li><a href="my-registrations.html">My Registrations</a></li>
            </ul>
          </div>

          <div>
            <h2 class="site-footer__heading">Information</h2>
            <ul class="site-footer__links">
              <li><a href="about.html">About Us</a></li>
              <li><a href="contact.html">Contact Organizers</a></li>
              <li>Student Union Room 112, Campus Center</li>
              <li>hello@eventify-campus.edu</li>
            </ul>
          </div>
        </div>

        <div class="site-footer__bottom">
          <span>&copy; 2026 Eventify Campus Events. Built for Web Development Coursework.</span>
          <span>Accessible HTML, CSS &amp; Vanilla JavaScript</span>
        </div>
      </div>
    `;
  }
}

/**
 * Generates HTML markup for a standard editorial event card.
 * Uses unboxed metadata separated by middots (no pill boxes).
 * @param {object} event
 * @returns {string}
 */
export function createEventCard(event) {
  const formattedDate = formatDate(event.date);

  return `
    <article class="event-card">
      <a href="event-details.html?id=${encodeURIComponent(event.id)}" class="media-frame" tabindex="-1" aria-hidden="true">
        <img
          src="${escapeHtml(event.image)}"
          alt="${escapeHtml(event.imageAlt)}"
          loading="lazy"
          referrerpolicy="no-referrer"
        />
        <div class="media-frame__fallback">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${escapeHtml(event.title)}</span>
        </div>
      </a>

      <div class="event-card__body">
        <div class="event-meta">
          <span class="event-meta__category">${escapeHtml(event.category)}</span>
          <span aria-hidden="true">&middot;</span>
          <time datetime="${escapeHtml(event.date)}" class="tabular-nums">${escapeHtml(formattedDate)}</time>
        </div>

        <h3 class="event-card__title">
          <a href="event-details.html?id=${encodeURIComponent(event.id)}">
            ${escapeHtml(event.title)}
          </a>
        </h3>

        <p class="event-card__summary">${escapeHtml(event.summary)}</p>

        <div class="event-card__footer">
          <span class="event-card__venue">${escapeHtml(event.location)}</span>
          <a href="event-details.html?id=${encodeURIComponent(event.id)}" class="text-link">
            View details
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Generates HTML markup for a consistent, helpful empty state.
 * @param {{ title: string, description: string, actionText?: string, actionHref?: string, buttonId?: string }} options
 * @returns {string}
 */
export function createEmptyState({ title, description, actionText, actionHref, buttonId }) {
  let actionMarkup = '';
  if (actionText && actionHref) {
    actionMarkup = `<a href="${escapeHtml(actionHref)}" class="btn btn--primary">${escapeHtml(actionText)}</a>`;
  } else if (actionText && buttonId) {
    actionMarkup = `<button type="button" id="${escapeHtml(buttonId)}" class="btn btn--secondary">${escapeHtml(actionText)}</button>`;
  }

  return `
    <div class="empty-state" role="status">
      <h2 class="empty-state__title">${escapeHtml(title)}</h2>
      <p class="empty-state__text">${escapeHtml(description)}</p>
      ${actionMarkup}
    </div>
  `;
}

/**
 * Attaches error handlers to all images inside a root element so broken images
 * gracefully reveal their styled CSS fallback container.
 * @param {ParentNode} root
 */
export function attachImageFallbacks(root = document) {
  const images = root.querySelectorAll('.media-frame img, .hero__media img');
  images.forEach((img) => {
    img.addEventListener('error', () => {
      const frame = img.closest('.media-frame, .hero__media');
      if (frame) {
        frame.classList.add('is-broken');
      }
    });
  });
}

/**
 * Validates standard email format.
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates phone numbers (requires at least 7 digits, allows spaces, hyphens, parentheses, and +).
 * @param {string} phone
 * @returns {boolean}
 */
export function validatePhone(phone) {
  const trimmed = phone.trim();
  if (!/^[+\d\s().-]+$/.test(trimmed)) return false;
  const digitsOnly = trimmed.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

/**
 * Displays an inline validation error message for a form control.
 * @param {HTMLElement} inputEl
 * @param {HTMLElement | null} errorEl
 * @param {string} message
 */
export function setFieldError(inputEl, errorEl, message) {
  inputEl.classList.add('has-error');
  inputEl.setAttribute('aria-invalid', 'true');
  if (errorEl) {
    errorEl.textContent = message;
  }
}

/**
 * Clears an inline validation error message for a form control.
 * @param {HTMLElement} inputEl
 * @param {HTMLElement | null} errorEl
 */
export function clearFieldError(inputEl, errorEl) {
  inputEl.classList.remove('has-error');
  inputEl.removeAttribute('aria-invalid');
  if (errorEl) {
    errorEl.textContent = '';
  }
}
