import { site, offers } from './config.js';
import { dateBounds, parseDate, offerById, availableTimes, validateProposals, formatDate, composeRequest } from './booking.js';

const menu = document.querySelector('.menu');
const navigation = document.querySelector('.nav-links');
document.documentElement.classList.add('js');

// Gentle scroll reveal. Without IntersectionObserver everything is shown at once.
const revealables = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  revealables.forEach(element => observer.observe(element));
} else revealables.forEach(element => element.classList.add('is-visible'));

const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Highlight the current section in an article's table of contents.
const tocLinks = [...document.querySelectorAll('.toc a')];
if (tocLinks.length && 'IntersectionObserver' in window) {
  const tocObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) tocLinks.forEach(a => a.classList.toggle('is-active', a.hash === `#${entry.target.id}`));
  }, { rootMargin: '-20% 0px -70% 0px' });
  tocLinks.forEach(a => { const target = document.getElementById(a.hash.slice(1)); if (target) tocObserver.observe(target); });
}

menu.hidden = false;
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  document.body.style.overflow = '';
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });

const booking = document.querySelector('[data-booking]');
if (booking) {
  const form = document.querySelector('#booking-form');
  const interest = document.querySelector('#interest');
  const format = document.querySelector('#format');
  const dayGrid = document.querySelector('#calendar-days');
  const monthLabel = document.querySelector('#calendar-month');
  const previous = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  const directDate = document.querySelector('#request-date');
  const timeOptions = document.querySelector('#time-options');
  const timeHint = document.querySelector('#time-hint');
  const list = document.querySelector('#proposal-list');
  const selectionStatus = document.querySelector('#selection-status');
  const status = document.querySelector('#booking-status');
  const result = document.querySelector('#request-result');
  const sent = document.querySelector('#request-sent');
  let proposals = [];
  let selectedDate = '';
  let displayedMonth = dateBounds().min.slice(0, 7);
  const requestedOffer = new URLSearchParams(location.search).get('paket');
  if (offers.some(offer => offer.id === requestedOffer)) interest.value = requestedOffer;

  function syncFormat() {
    format.options[1].disabled = interest.value === 'Sprechstunde';
    if (format.options[1].disabled) format.value = 'Zoom';
  }
  function renderDays() {
    const bounds = dateBounds();
    directDate.min = bounds.min;
    directDate.max = bounds.max;
    const first = parseDate(`${displayedMonth}-01`);
    monthLabel.textContent = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first);
    previous.disabled = displayedMonth <= bounds.min.slice(0, 7);
    next.disabled = displayedMonth >= bounds.max.slice(0, 7);
    dayGrid.replaceChildren();
    const offset = (first.getUTCDay() + 6) % 7;
    for (let i = 0; i < offset; i++) dayGrid.append(document.createElement('span'));
    const total = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    for (let day = 1; day <= total; day++) {
      const date = `${displayedMonth}-${String(day).padStart(2, '0')}`;
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = String(day); button.dataset.date = date;
      button.setAttribute('aria-label', formatDate(date));
      button.setAttribute('aria-pressed', String(selectedDate === date));
      button.disabled = !availableTimes(date, offerById(interest.value).minutes).length;
      if (proposals.some(p => p.date === date)) button.classList.add('has-proposal');
      button.addEventListener('click', () => {
        selectedDate = date; directDate.value = date;
        renderDays(); renderTimes();
        dayGrid.querySelector(`[data-date="${date}"]`)?.focus();
      });
      dayGrid.append(button);
    }
  }
  function renderTimes() {
    timeOptions.replaceChildren();
    const times = selectedDate ? availableTimes(selectedDate, offerById(interest.value).minutes) : [];
    timeHint.textContent = !selectedDate ? 'Wähle zuerst einen Tag.' : times.length ? `${formatDate(selectedDate)} · ${offerById(interest.value).minutes} Minuten · Uhrzeit anklicken, um sie hinzuzufügen.` : 'An diesem Tag sind keine passenden Zeiten anfragbar. Bitte wähle einen anderen Tag.';
    for (const time of times) {
      const chosen = proposals.some(p => p.date === selectedDate && p.time === time);
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = `${time} Uhr${chosen ? ' ✓' : ''}`;
      button.disabled = chosen || proposals.length >= site.maxProposals;
      button.setAttribute('aria-label', `${time} Uhr am ${formatDate(selectedDate)} hinzufügen`);
      button.addEventListener('click', () => {
        if (proposals.length >= site.maxProposals) return;
        proposals.push({ date: selectedDate, time });
        renderProposals(); renderTimes(); renderDays();
        list.lastElementChild?.querySelector('button').focus();
      });
      timeOptions.append(button);
    }
  }
  function renderProposals() {
    list.replaceChildren();
    document.querySelector('#proposal-count').textContent = `${proposals.length} / ${site.maxProposals}`;
    proposals.forEach((proposal, index) => {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = `${formatDate(proposal.date)} · ${proposal.time} Uhr`;
      const remove = document.createElement('button');
      remove.type = 'button'; remove.textContent = 'Entfernen';
      remove.setAttribute('aria-label', `${label.textContent} entfernen`);
      remove.addEventListener('click', () => {
        proposals.splice(index, 1);
        renderProposals(); renderTimes(); renderDays();
        const remaining = list.querySelector('button');
        if (remaining) remaining.focus();
        else dayGrid.querySelector('[aria-pressed="true"]')?.focus();
      });
      item.append(label, remove); list.append(item);
    });
    selectionStatus.textContent = proposals.length === site.maxProposals ? 'Drei Wunschzeiten ausgewählt. Zum Ändern zuerst eine Zeit entfernen.' : proposals.length ? `${proposals.length} Wunschzeit${proposals.length === 1 ? '' : 'en'} ausgewählt. Du kannst noch weitere Zeiten ergänzen.` : 'Noch keine Zeit ausgewählt.';
    status.textContent = '';
  }
  function moveMonth(offset) {
    const date = parseDate(`${displayedMonth}-01`);
    date.setUTCMonth(date.getUTCMonth() + offset);
    displayedMonth = date.toISOString().slice(0, 7); renderDays();
  }
  previous.addEventListener('click', () => moveMonth(-1));
  next.addEventListener('click', () => moveMonth(1));
  directDate.addEventListener('change', () => {
    if (!parseDate(directDate.value) || !directDate.validity.valid) {
      timeHint.textContent = 'Bitte wähle ein gültiges Datum innerhalb des angezeigten Zeitraums.'; return;
    }
    selectedDate = directDate.value; displayedMonth = selectedDate.slice(0, 7);
    renderDays(); renderTimes();
  });
  interest.addEventListener('change', () => {
    syncFormat();
    const before = proposals.length;
    proposals = proposals.filter(p => availableTimes(p.date, offerById(interest.value).minutes).includes(p.time));
    renderDays(); renderTimes(); renderProposals();
    if (before !== proposals.length) selectionStatus.textContent = 'Nicht mehr passende Zeiten wurden entfernt, weil dieses Gespräch länger dauert. Bitte ergänze neue Wunschzeiten.';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!validateProposals(proposals, interest.value)) {
      status.textContent = 'Bitte wähle ein bis drei gültige Wunschzeiten mit mindestens sieben Tagen Vorlauf.';
      status.focus(); return;
    }
    const name = form.elements.name.value.trim();
    if (name.length < 2 || /[\r\n]/.test(name)) {
      status.textContent = 'Bitte gib deinen Namen ein.'; form.elements.name.focus(); return;
    }
    const request = composeRequest({ name, email: form.elements.email.value, interest: interest.value, format: format.value, message: form.elements.message.value, proposals });
    // Without a form key, or if sending fails, the visitor gets the email draft instead.
    if (!site.formKey) return prepareDraft(request);
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true; status.textContent = 'Deine Anfrage wird gesendet …';
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: site.formKey, subject: `${request.subject} von ${name}`, from_name: 'Website babyschlaf-coach.de', name, email: form.elements.email.value.trim(), message: request.body, botcheck: form.elements.website.value }),
      });
      const answer = await response.json().catch(() => ({}));
      if (!response.ok || !answer.success) throw new Error('not sent');
      status.textContent = ''; form.hidden = true; sent.hidden = false;
      document.querySelector('#sent-title').focus();
    } catch { prepareDraft(request); }
    finally { button.disabled = false; }
  });
  function prepareDraft(request) {
    document.querySelector('#request-preview').value = `An: ${site.email}\nBetreff: ${request.subject}\n\n${request.body}`;
    document.querySelector('#open-mail').href = request.mailto;
    const gmail = new URL('https://mail.google.com/mail/');
    gmail.search = new URLSearchParams({ view: 'cm', fs: '1', to: site.email, su: request.subject, body: request.body }).toString();
    document.querySelector('#open-gmail').href = gmail.href;
    status.textContent = ''; form.hidden = true; result.hidden = false;
    document.querySelector('#copy-status').textContent = '';
    document.querySelector('#result-title').focus();
  }
  document.querySelector('#edit-request').addEventListener('click', () => {
    result.hidden = true; form.hidden = false; interest.focus();
  });
  document.querySelector('#copy-request').addEventListener('click', async () => {
    const preview = document.querySelector('#request-preview');
    try {
      await navigator.clipboard.writeText(preview.value);
      document.querySelector('#copy-status').textContent = 'Text kopiert. Bitte in eine E-Mail einfügen und selbst absenden.';
    } catch {
      preview.focus(); preview.select();
      document.querySelector('#copy-status').textContent = 'Bitte kopiere den markierten Text mit Strg+C beziehungsweise über das Kopiermenü.';
    }
  });
  syncFormat(); renderDays(); renderTimes(); renderProposals();
  booking.hidden = false;
}
