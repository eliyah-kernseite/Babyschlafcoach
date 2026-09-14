import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, availableTimes, composeRequest, dateBounds, localParts, parseDate, validateProposals } from '../assets/booking.js';
import { site, offers } from '../assets/config.js';

const sunday = new Date('2026-09-13T08:00:00Z');
test('Confirmed email, price ladder and appointment lengths', () => {
  assert.equal(site.email, 'babyschlafberatung.annalena@gmail.com');
  assert.deepEqual(offers.map(o => o.price), [0, 89, 149, 299, 479]);
  assert.deepEqual(offers.map(o => o.minutes), [20, 45, 60, 60, 60]);
});
test('Berlin date is independent of visitor timezone, with DST', () => {
  assert.deepEqual(localParts(new Date('2026-06-01T22:30:00Z')), {date: '2026-06-02', minutes: 30});
  assert.deepEqual(localParts(new Date('2026-12-01T23:30:00Z')), {date: '2026-12-02', minutes: 30});
});
test('Strict date parsing rejects impossible and incomplete dates', () => {
  for (const input of ['2026-02-30', '2026-13-01', '', null, '2026-1-01', '<script>']) assert.equal(parseDate(input), null);
  assert.ok(parseDate('2028-02-29'));
  assert.equal(addDays('2026-12-28', 7), '2027-01-04');
});
test('Request window is seven through ninety local days ahead', () => {
  assert.deepEqual(dateBounds(sunday), {min: '2026-09-20', max: '2026-12-12'});
  assert.deepEqual(availableTimes('2026-09-19', 20, sunday), []);
  assert.deepEqual(availableTimes('2026-12-14', 20, sunday), []);
});
test('Sundays are always closed', () => {
  for (const date of ['2026-09-20', '2026-09-27', '2026-10-25']) assert.deepEqual(availableTimes(date, 20, sunday), []);
});
test('Weekday slots finish before 19:00 and respect duration', () => {
  assert.deepEqual(availableTimes('2026-09-21', 20, sunday), ['17:00','17:30','18:00','18:30']);
  assert.deepEqual(availableTimes('2026-09-21', 45, sunday), ['17:00','17:30','18:00']);
  assert.deepEqual(availableTimes('2026-09-21', 60, sunday), ['17:00','17:30','18:00']);
  assert.deepEqual(availableTimes('2026-09-21', -1, sunday), []);
});
test('Saturday slots are 09:00–13:00', () => {
  assert.equal(availableTimes('2026-09-26', 20, sunday).at(0), '09:00');
  assert.equal(availableTimes('2026-09-26', 20, sunday).at(-1), '12:30');
  assert.equal(availableTimes('2026-09-26', 60, sunday).at(-1), '12:00');
});
test('Earliest day cannot start earlier than current Berlin time', () => {
  assert.deepEqual(availableTimes('2026-09-21', 20, new Date('2026-09-14T15:10:00Z')), ['17:30','18:00','18:30']);
  assert.deepEqual(availableTimes('2026-10-30', 20, new Date('2026-10-23T15:10:00Z')), ['17:30','18:00','18:30']);
});
test('One through three distinct proposals; reject tampering', () => {
  const one = {date: '2026-09-21', time: '17:00'};
  const three = [one, {date: '2026-09-22', time: '17:30'}, {date: '2026-09-26', time: '09:00'}];
  assert.equal(validateProposals([one], 'Basis', sunday), true);
  assert.equal(validateProposals(three, 'Premium', sunday), true);
  for (const value of [[], null, [null], [one, one], [...three, {date: '2026-09-26', time: '10:00'}], [{date: '2026-09-20', time: '17:00'}], [{date: '2026-09-21', time: '18:30'}]]) assert.equal(validateProposals(value, 'Basis', sunday), false);
  assert.equal(validateProposals([one], 'Unknown', sunday), false);
});
test('Message safely encodes special characters; never claims sent or booked', () => {
  const r = composeRequest({name: '  Test & Muster  ', email: 'test@example.invalid', interest: 'Sprechstunde', format: 'Zoom', message: 'Frage: ä + & # ?', proposals: [{date:'2026-09-21', time:'17:00'}]});
  const parsed = new URL(r.mailto);
  assert.equal(parsed.pathname, site.email);
  assert.equal(parsed.searchParams.get('body'), r.body);
  assert.match(r.body, /89 Euro/);
  assert.match(r.body, /Name: Test & Muster\n/);
  assert.match(r.body, /noch keine feste Buchung/);
  assert.match(r.body, /Europe\/Berlin/);
});
