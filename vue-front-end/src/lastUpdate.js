/**
 * lastUpdate(input, now)
 * Returns a compact relative label like:
 * - just now
 * - 4 min ago
 * - 2 hours ago
 * - 3 days ago
 *
 * @param {Date|string|number} input
 * @param {Date} [now]
 * @returns {string}
 */
export function lastUpdate(input, now = new Date()) {
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return 'unknown'

  const diffMs = Math.max(0, now.getTime() - date.getTime())
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < minute) return 'just now'
  if (diffMs < hour) {
    const mins = Math.floor(diffMs / minute)
    return `${mins} min ago`
  }
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  const days = Math.floor(diffMs / day)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

/**
 * formatLastUpdate(input, now)
 * Convenience wrapper for UI title form.
 *
 * @param {Date|string|number} input
 * @param {Date} [now]
 * @returns {string}
 */
export function formatLastUpdate(input, now = new Date()) {
  return `LAST UPDATE: ${String(lastUpdate(input, now)).toUpperCase()}`
}

