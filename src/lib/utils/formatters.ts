import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { nl, fr } from 'date-fns/locale'

// Number formatters
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatCurrency(value: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency,
  }).format(value)
}

// Date formatters
export function formatDate(date: string | Date, formatStr = 'PP'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return 'Invalid date'
  return format(d, formatStr)
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return 'Invalid date'
  return format(d, 'PPp')
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return 'Invalid date'
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDateByLanguage(
  date: string | Date,
  language: 'nl' | 'fr' = 'nl',
  formatStr = 'PP'
): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return 'Invalid date'
  const locale = language === 'fr' ? fr : nl
  return format(d, formatStr, { locale })
}

// Phone formatters
export function formatPhone(phone: string): string {
  // Belgian phone number formatting
  if (phone.startsWith('+32')) {
    const cleaned = phone.replace(/\D/g, '').slice(2)
    if (cleaned.length === 9) {
      return `+32 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`
    }
  }
  return phone
}

// Status formatters
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    paused: 'bg-gray-100 text-gray-800',
    interested: 'bg-green-100 text-green-800',
    not_interested: 'bg-red-100 text-red-800',
    confused: 'bg-yellow-100 text-yellow-800',
    ambiguous: 'bg-purple-100 text-purple-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Language formatters
export function formatLanguage(lang: 'nl' | 'fr'): string {
  return lang === 'nl' ? 'Dutch' : 'French'
}

export function getLanguageEmoji(lang: 'nl' | 'fr'): string {
  return lang === 'nl' ? '🇳🇱' : '🇫🇷'
}

// Trend formatters
export function formatTrend(value: number): { text: string; color: string; direction: 'up' | 'down' | 'neutral' } {
  if (value > 0) {
    return {
      text: `+${value.toFixed(1)}%`,
      color: 'text-green-600',
      direction: 'up',
    }
  } else if (value < 0) {
    return {
      text: `${value.toFixed(1)}%`,
      color: 'text-red-600',
      direction: 'down',
    }
  }
  return {
    text: '0%',
    color: 'text-gray-500',
    direction: 'neutral',
  }
}
