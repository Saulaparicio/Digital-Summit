import { AgendaItem } from '../types/agenda';

/**
 * Converts 'HH:mm' string to total minutes from 00:00.
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converts minutes from 00:00 to 'HH:mm' string.
 */
export function minutesToTimeString(minutes: number): string {
  const normalized = Math.max(0, Math.min(24 * 60 - 1, Math.floor(minutes)));
  const hrs = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Formats seconds into MM:SS or HH:MM:SS with tabular digits.
 */
export function formatSecondsToDigital(totalSeconds: number): string {
  const isNegative = totalSeconds < 0;
  const absSeconds = Math.abs(totalSeconds);
  const hrs = Math.floor(absSeconds / 3600);
  const mins = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;

  const prefix = isNegative ? '+ ' : ''; // Overtime indicator
  if (hrs > 0) {
    return `${prefix}${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${prefix}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats time string to 12h format (e.g., '14:25' -> '2:25 PM').
 */
export function formatTo12Hour(timeStr: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export type ActivityStatus = 'completed' | 'current' | 'next' | 'upcoming';

/**
 * Determines current status, progress percentage, and time details for an activity.
 */
export function getActivityMetrics(
  item: AgendaItem,
  currentSecondsOfDay: number,
  isNextCandidate: boolean
): {
  status: ActivityStatus;
  progressPercent: number;
  secondsRemaining: number;
  secondsUntilStart: number;
  durationMinutes: number;
} {
  const startSec = timeStringToMinutes(item.startTime) * 60;
  const endSec = timeStringToMinutes(item.endTime) * 60;
  const durationSec = Math.max(60, endSec - startSec);
  const durationMinutes = Math.round(durationSec / 60);

  if (currentSecondsOfDay >= endSec) {
    return {
      status: 'completed',
      progressPercent: 100,
      secondsRemaining: 0,
      secondsUntilStart: 0,
      durationMinutes
    };
  }

  if (currentSecondsOfDay >= startSec && currentSecondsOfDay < endSec) {
    const elapsed = currentSecondsOfDay - startSec;
    const remaining = endSec - currentSecondsOfDay;
    const progress = Math.min(100, Math.max(0, (elapsed / durationSec) * 100));
    return {
      status: 'current',
      progressPercent: progress,
      secondsRemaining: remaining,
      secondsUntilStart: 0,
      durationMinutes
    };
  }

  // Future item
  const secondsUntilStart = startSec - currentSecondsOfDay;
  return {
    status: isNextCandidate ? 'next' : 'upcoming',
    progressPercent: 0,
    secondsRemaining: durationSec,
    secondsUntilStart,
    durationMinutes
  };
}

/**
 * Finds current activity (if any) and the imminent next activity.
 */
export function getActiveAndNextActivities(
  items: AgendaItem[],
  currentSecondsOfDay: number
): {
  currentActivity: AgendaItem | null;
  nextActivity: AgendaItem | null;
  nextActivitySeconds: number | null;
} {
  // Sort items by start time
  const sorted = [...items].sort(
    (a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime)
  );

  let currentActivity: AgendaItem | null = null;
  let nextActivity: AgendaItem | null = null;
  let nextActivitySeconds: number | null = null;

  for (const item of sorted) {
    const startSec = timeStringToMinutes(item.startTime) * 60;
    const endSec = timeStringToMinutes(item.endTime) * 60;

    if (currentSecondsOfDay >= startSec && currentSecondsOfDay < endSec) {
      currentActivity = item;
    } else if (currentSecondsOfDay < startSec && !nextActivity) {
      nextActivity = item;
      nextActivitySeconds = startSec - currentSecondsOfDay;
    }
  }

  return { currentActivity, nextActivity, nextActivitySeconds };
}

/**
 * Shifts scheduled items by +/- deltaMinutes starting from a specific item (or all remaining items).
 */
export function shiftScheduleTimes(
  items: AgendaItem[],
  deltaMinutes: number,
  fromItemId?: string
): AgendaItem[] {
  let shouldShift = !fromItemId;

  return items.map((item) => {
    if (fromItemId && item.id === fromItemId) {
      shouldShift = true;
    }

    if (!shouldShift) return item;

    const startMins = Math.max(0, Math.min(23 * 60 + 55, timeStringToMinutes(item.startTime) + deltaMinutes));
    const endMins = Math.max(startMins + 5, Math.min(23 * 60 + 59, timeStringToMinutes(item.endTime) + deltaMinutes));

    return {
      ...item,
      startTime: minutesToTimeString(startMins),
      endTime: minutesToTimeString(endMins)
    };
  });
}
