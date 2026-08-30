import SyncLog from "../models/SyncLog.js";

function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function daysElapsedInMonth(year, month) {
  // month is 0-indexed. Caps at "today" for the current month; the full
  // month length for any month already in the past.
  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;
  if (isCurrentMonth) return now.getDate();
  return new Date(year, month + 1, 0).getDate();
}

function activeDaysInMonth(logDayKeys, year, month) {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const days = new Set();
  for (const key of logDayKeys) {
    if (key.startsWith(prefix)) days.add(key);
  }
  return days.size;
}

// Everything here is derived from real SyncLog rows plus the user's actual
// connected-platform count - nothing is a stored counter that could drift
// from reality, and nothing is fabricated.
export async function computeActivityStats(userId, connectedPlatformCount) {
  const logs = await SyncLog.find({ user: userId }).sort({ createdAt: -1 }).lean();
  const logDayKeys = [...new Set(logs.map((l) => dayKey(l.createdAt)))].sort().reverse();

  // Day streak: walk backward from today, counting consecutive calendar
  // days that have at least one sync action.
  let dayStreak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const logDaySet = new Set(logDayKeys);
  // Allow the streak to still count if today has no activity yet but
  // yesterday does (streak isn't broken until a full day is skipped).
  if (!logDaySet.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (logDaySet.has(dayKey(cursor))) {
    dayStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const now = new Date();
  const thisMonthActive = activeDaysInMonth(logDayKeys, now.getFullYear(), now.getMonth());
  const thisMonthElapsed = daysElapsedInMonth(now.getFullYear(), now.getMonth());
  const activeThisMonth = thisMonthElapsed > 0 ? Math.round((thisMonthActive / thisMonthElapsed) * 100) : 0;

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthActive = activeDaysInMonth(logDayKeys, lastMonthDate.getFullYear(), lastMonthDate.getMonth());
  const lastMonthElapsed = daysElapsedInMonth(lastMonthDate.getFullYear(), lastMonthDate.getMonth());
  const activeLastMonth = lastMonthElapsed > 0 ? Math.round((lastMonthActive / lastMonthElapsed) * 100) : 0;
  const activeChange = activeThisMonth - activeLastMonth;

  const totalContributions = logs.filter((l) => {
    const d = new Date(l.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  // Real, reachable milestones - each one only turns on once the
  // underlying condition is actually true.
  let achievements = 0;
  if (connectedPlatformCount >= 1) achievements += 1;
  if (connectedPlatformCount >= 3) achievements += 1;
  if (dayStreak >= 3) achievements += 1;
  if (dayStreak >= 7) achievements += 1;
  if (logs.length >= 10) achievements += 1;

  return { dayStreak, activeThisMonth, activeChange, achievements, totalContributions };
}

export async function logSync(userId, platform, action) {
  await SyncLog.create({ user: userId, platform, action });
}
