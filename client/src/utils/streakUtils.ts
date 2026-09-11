export function calculateStreak(dates: string[]): number {
  if (!dates.length) {
    return 0;
  }

  // Remove duplicate dates and normalize them to YYYY-MM-DD
  const uniqueDates = [...new Set(
    dates.map((date) => new Date(date).toISOString().split("T")[0])
  )];

  // Sort newest date first
  uniqueDates.sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  let streak = 1;

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const previousDate = new Date(uniqueDates[i + 1]);

    const differenceInDays =
      (currentDate.getTime() - previousDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (differenceInDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}