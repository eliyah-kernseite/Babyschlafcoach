// DOM simulation only; this does not verify visual layout or a real browser.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { site, offers } from '../assets/config.js';
import * as bookingFunctions from '../assets/booking.js';
const html = await readFile(new URL('../kontakt.html', import.meta.url), 'utf8');
const code = (await readFile(new URL('../assets/site.js', import.meta.url), 'utf8')).replace(/^import .*;\n/gm, '');
function boot(query = '') {
  const dom = new JSDOM(html, {url: `${site.url}kontakt.html${query}`, runScripts: 'outside-only'});
  Object.assign(dom.window, {site, offers, ...bookingFunctions});
  const fixedNow = new Date('2026-09-13T08:00:00Z');
  dom.window.dateBounds = () => bookingFunctions.dateBounds(fixedNow);
  dom.window.availableTimes = (date, minutes) => bookingFunctions.availableTimes(date, minutes, fixedNow);
  dom.window.validateProposals = (proposals, offer) => bookingFunctions.validateProposals(proposals, offer, fixedNow);
  dom.window.eval(code);
  const doc = dom.window.document;
  const change = node => node.dispatchEvent(new dom.window.Event('change', {bubbles:true}));
  const select = () => {
    doc.querySelector('#calendar-days button:not(:disabled)').click();
    doc.querySelector('#time-options button:not(:disabled)').click();
  };
  const submit = () => {
    doc.querySelector('#name').value = 'Test Familie';
    doc.querySelector('#email').value = 'test@example.invalid';
    doc.querySelector('#booking-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
  };
  return {dom,doc,change,select,submit};
}
test('Menu opens and Escape closes it with focus restored', () => {
  const {dom,doc}=boot(); const menu=doc.querySelector('.menu');
  assert.equal(menu.hidden,false); menu.click();
  assert.equal(menu.getAttribute('aria-expanded'),'true');
  assert.ok(doc.querySelector('.nav-links').classList.contains('open'));
  doc.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  assert.equal(menu.getAttribute('aria-expanded'),'false');
  assert.equal(doc.activeElement,menu); dom.window.close();
});
test('Calendar month navigation and labelled dates', () => {
  const {dom,doc}=boot();
  assert.equal(doc.querySelector('[data-booking]').hidden,false);
  assert.equal(doc.querySelector('[data-prev]').disabled,true);
  const first=doc.querySelector('#calendar-month').textContent;
  doc.querySelector('[data-next]').click();
  assert.notEqual(doc.querySelector('#calendar-month').textContent,first);
  doc.querySelector('[data-prev]').click();
  assert.equal(doc.querySelector('#calendar-month').textContent,first);
  for (const button of doc.querySelectorAll('#calendar-days button')) assert.ok(button.getAttribute('aria-label'));
  dom.window.close();
});
test('Three proposals enforce maximum; removal restores controls', () => {
  const {dom,doc,select}=boot(); select();
  doc.querySelector('#time-options button:not(:disabled)').click();
  doc.querySelector('#time-options button:not(:disabled)').click();
  assert.equal(doc.querySelectorAll('#proposal-list li').length,3);
  assert.equal(doc.querySelectorAll('#time-options button:not(:disabled)').length,0);
  assert.match(doc.querySelector('#selection-status').textContent,/Drei Wunschzeiten/);
  doc.querySelector('#proposal-list button').click();
  assert.equal(doc.querySelectorAll('#proposal-list li').length,2);
  assert.ok(doc.querySelector('#time-options button:not(:disabled)')); dom.window.close();
});
test('Sprechstunde removes late starts and forces Zoom', () => {
  const {dom,doc,change}=boot();
  doc.querySelector('#calendar-days button:not(:disabled)').click();
  [...doc.querySelectorAll('#time-options button')].at(-1).click();
  doc.querySelector('#format').value='Telefon';
  doc.querySelector('#interest').value='Sprechstunde'; change(doc.querySelector('#interest'));
  assert.equal(doc.querySelector('#format').value,'Zoom');
  assert.equal(doc.querySelector('#format').options[1].disabled,true);
  assert.equal(doc.querySelectorAll('#proposal-list li').length,0); dom.window.close();
});
test('Empty request is rejected; full request creates an unsent, editable draft', () => {
  const {dom,doc,select,submit}=boot('?paket=Premium');
  assert.equal(doc.querySelector('#interest').value,'Premium'); submit();
  assert.equal(doc.querySelector('#request-result').hidden,true);
  assert.match(doc.querySelector('#booking-status').textContent,/ein bis drei/);
  select(); submit();
  assert.equal(doc.querySelector('#request-result').hidden,false);
  assert.equal(doc.querySelector('#booking-form').hidden,true);
  assert.equal(doc.activeElement.id,'result-title');
  const mail=new URL(doc.querySelector('#open-mail').href);
  const gmail=new URL(doc.querySelector('#open-gmail').href);
  assert.equal(mail.pathname,site.email);
  assert.equal(gmail.searchParams.get('to'),site.email);
  assert.equal(gmail.searchParams.get('body'),mail.searchParams.get('body'));
  assert.match(doc.querySelector('#request-preview').value,/479 Euro/);
  assert.match(doc.querySelector('#request-result').textContent,/Noch nicht versendet/);
  doc.querySelector('#edit-request').click();
  assert.equal(doc.querySelector('#booking-form').hidden,false);
  assert.equal(doc.querySelectorAll('#proposal-list li').length,1); dom.window.close();
});
test('Unknown query cannot inject markup; no-JS fallback links to email', () => {
  const {dom,doc}=boot('?paket=%3Cscript%3Ebad%3C/script%3E');
  assert.equal(doc.querySelector('#interest').value,'Kennenlernen');
  const noJs=new JSDOM(html,{url:site.url});
  assert.ok(noJs.window.document.querySelector('noscript a.button').href.startsWith('mailto:'));
  assert.equal(noJs.window.document.querySelector('[data-booking]').hidden,true);
  dom.window.close(); noJs.window.close();
});
