// Public configuration only. Never put credentials or private calendar data here.
export const site = Object.freeze({
  name: 'Babyschlafberatung Anna-Lena Korb',
  url: 'https://babyschlaf-coach.de/',
  email: 'babyschlafcoach.annalena@gmail.com',
  // Web3Forms access key: public by design, only allows sending to the verified address above.
  formKey: 'efb568c9-54dd-4cce-b682-336d0d65016d',
  telephone: '+491732584141',
  telephoneDisplay: '0173 2584141',
  childcareUrl: 'https://xn--kinderkrbchen-omb.com/',
  timezone: 'Europe/Berlin',
  minimumNoticeDays: 7,
  bookingHorizonDays: 90,
  maxProposals: 3,
  slotStepMinutes: 30,
  hours: { 1: [17 * 60, 19 * 60], 2: [17 * 60, 19 * 60], 3: [17 * 60, 19 * 60], 4: [17 * 60, 19 * 60], 5: [17 * 60, 19 * 60], 6: [9 * 60, 13 * 60] },
});

// These are request lengths, not an assertion of live calendar availability.
export const offers = Object.freeze([
  { id: 'Kennenlernen', name: 'Kostenloses Kennenlernen', price: 0, minutes: 20 },
  { id: 'Sprechstunde', name: 'Schlafsprechstunde', price: 89, minutes: 45 },
  { id: 'Basis', name: 'Basis', price: 149, minutes: 60 },
  { id: 'Intensiv', name: 'Intensiv', price: 299, minutes: 60 },
  { id: 'Premium', name: 'Premium', price: 479, minutes: 60 },
]);
