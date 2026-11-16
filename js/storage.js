/**
 * LocalStorage Persistence Helpers for Eventify
 * Handles saving, reading, and removing event registrations
 * as well as storing contact inquiries locally in the browser.
 */

const REGISTRATIONS_KEY = 'eventify_registrations_v1';
const CONTACT_MESSAGES_KEY = 'eventify_contact_messages_v1';

/**
 * Safely retrieves all saved event registrations from LocalStorage.
 * @returns {Array<object>}
 */
export function getRegistrations() {
  try {
    const rawData = localStorage.getItem(REGISTRATIONS_KEY);
    if (!rawData) return [];
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Could not read registrations from LocalStorage:', error);
    return [];
  }
}

/**
 * Checks whether a given email is already registered for a specific event.
 * @param {string} eventId
 * @param {string} email
 * @returns {boolean}
 */
export function isDuplicateRegistration(eventId, email) {
  const normalizedEmail = email.trim().toLowerCase();
  const registrations = getRegistrations();
  return registrations.some(
    (entry) => entry.eventId === eventId && entry.email.trim().toLowerCase() === normalizedEmail
  );
}

/**
 * Saves a new event registration record and returns the created entry.
 * @param {{ name: string, email: string, phone: string, eventId: string, notes?: string }} formData
 * @returns {object}
 */
export function saveRegistration(formData) {
  const registrations = getRegistrations();

  // Generate a short, human-readable reference code (e.g., EV-4821)
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const newRegistration = {
    id: `reg_${Date.now()}_${randomCode}`,
    referenceCode: `EV-${randomCode}`,
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    eventId: formData.eventId,
    notes: formData.notes ? formData.notes.trim() : '',
    registeredAt: new Date().toISOString()
  };

  registrations.unshift(newRegistration);

  try {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
  } catch (error) {
    console.error('Could not save registration to LocalStorage:', error);
  }

  return newRegistration;
}

/**
 * Removes a registration by its unique ID.
 * @param {string} registrationId
 * @returns {Array<object>} Updated list of registrations
 */
export function removeRegistration(registrationId) {
  const updated = getRegistrations().filter((entry) => entry.id !== registrationId);
  try {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Could not update registrations in LocalStorage:', error);
  }
  return updated;
}

/**
 * Returns the number of local registrations recorded for a given event.
 * @param {string} eventId
 * @returns {number}
 */
export function getRegistrationCountForEvent(eventId) {
  return getRegistrations().filter((entry) => entry.eventId === eventId).length;
}

/**
 * Saves a contact form inquiry in LocalStorage so submissions persist cleanly.
 * @param {{ name: string, email: string, topic: string, message: string }} contactData
 * @returns {object}
 */
export function saveContactMessage(contactData) {
  let messages = [];
  try {
    const raw = localStorage.getItem(CONTACT_MESSAGES_KEY);
    messages = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(messages)) messages = [];
  } catch {
    messages = [];
  }

  const record = {
    id: `msg_${Date.now()}`,
    name: contactData.name.trim(),
    email: contactData.email.trim(),
    topic: contactData.topic,
    message: contactData.message.trim(),
    submittedAt: new Date().toISOString()
  };

  messages.unshift(record);

  try {
    localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Could not store contact message:', error);
  }

  return record;
}
