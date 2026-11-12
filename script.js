/* Maison Ember — dependency-free progressive enhancements */
'use strict';

const toggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#navigation');
function closeNavigation() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('open');
  document.body.classList.remove('nav-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', open);
  document.body.classList.toggle('nav-open', open);
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNavigation));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeNavigation();
    toggle.focus();
  }
  if (event.key === 'Tab' && navigation.classList.contains('open')) {
    const last = navigation.querySelector('a:last-child');
    if (event.shiftKey && document.activeElement === toggle) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      toggle.focus();
    }
  }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
  if (event.matches) closeNavigation();
});

// Reveal once; keep the full page readable when scripting or motion is unavailable.
if (
  'IntersectionObserver' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-category]').forEach((card) => {
      card.hidden =
        button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) card.classList.add('visible');
    });
  });
});

// Illustrative editorial reviews, clearly identified as concept content in the page.
const reviews = [
  {
    quote:
      'The kind of place you find yourself thinking about long after the evening ends. Beautiful food, warm service, and an atmosphere that feels effortlessly special.',
    name: 'Charlotte M.',
    occasion: 'A memorable anniversary dinner',
  },
  {
    quote:
      'Every course felt considered, from the first bite to the last little indulgence. We came for dinner and stayed for the wonderful sense of occasion.',
    name: 'James R.',
    occasion: 'An evening with good friends',
  },
  {
    quote:
      'A beautiful balance of understated elegance and genuine warmth. The fire-cooked flavors were a highlight, and nothing ever felt rushed.',
    name: 'Sophie L.',
    occasion: 'A birthday worth remembering',
  },
];
let reviewIndex = 0;
function showReview(direction) {
  reviewIndex = (reviewIndex + direction + reviews.length) % reviews.length;
  const review = reviews[reviewIndex];
  document.querySelector('#review-quote').textContent = review.quote;
  document.querySelector('#review-name').textContent = review.name;
  document.querySelector('#review-occasion').textContent = review.occasion;
  document.querySelector('#review-count').textContent =
    `${String(reviewIndex + 1).padStart(2, '0')} / 03`;
  document.querySelector('#review-announcement').textContent =
    `Review ${reviewIndex + 1} of 3. ${review.quote} ${review.name}`;
}
document.querySelector('#review-prev').addEventListener('click', () => showReview(-1));
document.querySelector('#review-next').addEventListener('click', () => showReview(1));

const dialog = document.querySelector('#gallery-dialog');
document.querySelectorAll('.gallery-item').forEach((button) => {
  button.addEventListener('click', () => {
    const source = button.querySelector('img');
    document.querySelector('#lightbox-image').src = source.src;
    document.querySelector('#lightbox-image').alt = source.alt;
    document.querySelector('#lightbox-caption').textContent = source.alt;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});
document.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
});

const dateInput = document.querySelector('#reservation-date');
function localToday() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}
dateInput.min = localToday();
dateInput.addEventListener('input', () => dateInput.setCustomValidity(''));
const form = document.querySelector('.reservation-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  dateInput.min = localToday();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const selectedDate = new Date(`${values.get('date')}T12:00:00`);
  const status = document.querySelector('#form-status');
  if (selectedDate.getDay() === 1) {
    dateInput.setCustomValidity('We rest on Mondays. Please choose Tuesday through Sunday.');
    dateInput.reportValidity();
    return;
  }
  const weekday = selectedDate.getDay();
  const lastTime = weekday === 0 ? '20:00' : weekday >= 2 && weekday <= 4 ? '21:00' : '21:00';
  if (values.get('time') > lastTime) {
    status.textContent =
      'For Sunday dining, please select a time at or before 20:00 so you can enjoy your evening before we close at 21:00.';
    status.focus();
    return;
  }
  const displayDate = selectedDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  status.textContent = `Thank you, ${String(values.get('name')).trim()}. Your sample request is ready: ${values.get('guests')}, ${displayDate} at ${values.get('time')}. This is a portfolio demo; no reservation has been sent or confirmed.`;
  status.focus();
});
document.querySelector('#year').textContent = new Date().getFullYear();
