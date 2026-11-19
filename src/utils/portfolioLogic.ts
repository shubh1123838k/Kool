export interface NoteEditResult {
  value: string;
  caret: number;
}

export interface ContactNoteInput {
  name: string;
  email: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  error?: string;
  cleaned: ContactNoteInput;
}

export function editNoteValue(
  value: string,
  start: number,
  end: number,
  key: string,
  limit: number
): NoteEditResult {
  const safeStart = Math.max(0, Math.min(start, value.length));
  const safeEnd = Math.max(safeStart, Math.min(end, value.length));

  if (key === 'Backspace') {
    let nextStart = safeStart;
    if (safeStart === safeEnd && safeStart > 0) {
      const prefixChars = Array.from(value.slice(0, safeStart));
      const lastChar = prefixChars[prefixChars.length - 1] ?? '';
      nextStart -= lastChar.length;
    }
    return {
      value: value.slice(0, nextStart) + value.slice(safeEnd),
      caret: nextStart,
    };
  }

  const effectiveLimit = limit > 0 ? limit : Number.POSITIVE_INFINITY;
  const available = Math.max(0, effectiveLimit - (value.length - (safeEnd - safeStart)));
  let inserted = '';
  for (const ch of Array.from(key)) {
    if (inserted.length + ch.length <= available) {
      inserted += ch;
    } else {
      break;
    }
  }

  return {
    value: value.slice(0, safeStart) + inserted + value.slice(safeEnd),
    caret: safeStart + inserted.length,
  };
}

export function calculatePaperFeed(measuredHeight: number, baseHeight = 85, lineHeight = 24): number {
  const safeHeight = Math.max(measuredHeight, baseHeight);
  if (safeHeight <= baseHeight) return 0;
  return Math.max(0, Math.ceil((safeHeight - baseHeight) / lineHeight) * lineHeight);
}

export function formatMachineCounter(length: number): string {
  return String(Math.max(0, Math.floor(length))).padStart(3, '0');
}

export function computeTearedProgressPercent(elapsedMs: number, durationMs = 2450): number {
  if (durationMs <= 0) return 100;
  const t = Math.max(0, Math.min(elapsedMs / durationMs, 1));
  return Math.round((1 - Math.pow(1 - t, 2.5)) * 100);
}

export function computeActiveSectionId(
  sections: Array<{ id: string; top: number }>,
  viewportHeight: number
): string {
  if (sections.length === 0) return 'home';
  const threshold = viewportHeight * 0.4;
  let current = sections[0].id;
  for (const section of sections) {
    if (section.top <= threshold) {
      current = section.id;
    }
  }
  return current;
}

export function validateContactNote(input: ContactNoteInput): ContactValidationResult {
  const name = input.name.trim().slice(0, 60);
  const email = input.email.trim().slice(0, 120);
  const message = input.message.trim().slice(0, 400);

  if (!name) {
    return { valid: false, error: 'Please enter your name.', cleaned: { name, email, message } };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.', cleaned: { name, email, message } };
  }
  if (!message) {
    return { valid: false, error: 'Please write a short note before sending.', cleaned: { name, email, message } };
  }
  return { valid: true, cleaned: { name, email, message } };
}
