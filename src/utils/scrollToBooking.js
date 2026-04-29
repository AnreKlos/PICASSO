export function scrollToBooking() {
  const target =
    document.getElementById('bookingContacts-section') ||
    document.getElementById('booking');

  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
