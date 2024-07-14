export function IsDatePassedToday(givenDate: Date) {
  // Normalize today's date to remove time part
  const today = new Date().setHours(0, 0, 0, 0);

  // Normalize the given date to remove time part
  const givenDateNormalized = new Date(givenDate).setHours(0, 0, 0, 0);

  // Check if the given date has already passed today
  const isDatePassed = givenDateNormalized <= today;

  return isDatePassed;
}

export function formatDateForInput(date: Date | undefined | null) {
  if (!date || isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString().slice(0, 10);
}

export function IsScholarNearing(givenDate: Date): boolean {
  // Normalize today's date to remove time part
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Normalize the given date to remove time part
  const givenDateNormalized = new Date(givenDate);
  givenDateNormalized.setHours(0, 0, 0, 0);

  // Calculate the date 3 days from today
  const threeDaysFromNow = new Date(todayStart.getTime());
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Check if the given date is within the next 3 days from today
  const isDateWithinNextThreeDays = givenDateNormalized >= todayStart && givenDateNormalized <= threeDaysFromNow;

  return isDateWithinNextThreeDays;
}
