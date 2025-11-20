/**
 * Date utility functions
 */

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  const now = new Date();
  return formatDateToISO(now);
}

/**
 * Format Date object to YYYY-MM-DD
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get date from one year ago (same day)
 */
export function getLastYearDate(date: Date = new Date()): string {
  const lastYear = new Date(date);
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  return formatDateToISO(lastYear);
}

/**
 * Parse YYYY-MM-DD string to Date object
 */
export function parseISODate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format date for display in Korean
 * @example "11월 19일 화요일"
 */
export function formatDateKorean(dateString: string): string {
  const date = parseISODate(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][
    date.getDay()
  ];

  return `${month}월 ${day}일 ${dayOfWeek}`;
}

/**
 * Format date for display in English
 * @example "Tuesday, November 19"
 */
export function formatDateEnglish(dateString: string): string {
  const date = parseISODate(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get relative year text
 * @example "2023년 (작년)" or "2024년 (올해)"
 */
export function getYearLabel(dateString: string, language: 'ko' | 'en' = 'ko'): string {
  const date = parseISODate(dateString);
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();

  if (language === 'ko') {
    if (year === currentYear) {
      return `${year}년 (올해)`;
    } else if (year === currentYear - 1) {
      return `${year}년 (작년)`;
    } else {
      return `${year}년`;
    }
  } else {
    if (year === currentYear) {
      return `${year} (This Year)`;
    } else if (year === currentYear - 1) {
      return `${year} (Last Year)`;
    } else {
      return `${year}`;
    }
  }
}

/**
 * Get time ago string
 * @example "방금", "1분 전", "2시간 전"
 */
export function getTimeAgo(date: Date, language: 'ko' | 'en' = 'ko'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (language === 'ko') {
    if (diffSec < 60) return '방금';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    return `${diffDay}일 전`;
  } else {
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${diffDay}d ago`;
  }
}
