/**
 * Utility functions — ported from Flutter formatStrings & converts
 */

export function formatCurrencyShort(value) {
  const amount = _toNumber(value)
  if (amount === null) return '$0'
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''
  if (abs >= 1e9) return `${sign}$${_trimZeros((abs / 1e9).toFixed(2))}B`
  if (abs >= 1e6) return `${sign}$${_trimZeros((abs / 1e6).toFixed(2))}M`
  if (abs >= 1e3) return `${sign}$${Math.round(abs / 1e3)}K`
  if (abs % 1 === 0) return `${sign}$${Math.floor(abs)}`
  return `${sign}$${abs.toFixed(2)}`
}

export function formatCurrency(value) {
  const amount = _toNumber(value)
  if (amount === null) return '$0'
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''
  const isInt = abs % 1 === 0
  const raw = isInt ? Math.floor(abs).toString() : abs.toFixed(2)
  const [intPart, fracPart] = raw.split('.')
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const hasFrac = fracPart && fracPart !== '00'
  return `${sign}$${hasFrac ? `${formatted}.${fracPart}` : formatted}`
}

export function capitalize(text) {
  if (!text) return ''
  return String(text).charAt(0).toUpperCase() + String(text).slice(1)
}

export function replaceUnderscoreToSpace(text) {
  return (text ?? '').replace(/_/g, ' ')
}

export function replaceUnderscoreToEmpty(text) {
  return (text ?? '').replace(/_/g, '')
}

export function formatValueShort(value) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1e9) return `${sign}${_trimZeros((abs / 1e9).toFixed(2))}B`
  if (abs >= 1e6) return `${sign}${_trimZeros((abs / 1e6).toFixed(2))}M`
  if (abs >= 1e3) return `${sign}${_trimZeros((abs / 1e3).toFixed(2))}K`
  return value === Math.round(value) ? String(value) : value.toFixed(2)
}

function _toNumber(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  const cleaned = String(value).trim().replace(/[^\d.\-]/g, '')
  if (!cleaned || cleaned === '-' || cleaned === '.') return null
  return parseFloat(cleaned)
}

function _trimZeros(str) {
  return str.replace(/\.?0+$/, '')
}
