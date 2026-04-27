import { h } from 'vue'
import { buildIcon } from './icon.js'

/**
 * buildImageProfile(src, options) - Profile avatar builder
 *
 * Options:
 *   src            {string}
 *   alt            {string}
 *   name           {string}   Used for initials fallback
 *   size           {number}   Avatar size in px. Default: 42
 *   ring           {string}   Ring/border color. Default: '#e2e8f0'
 *   ringWidth      {number}   Ring width in px. Default: 0
 *   fit            {'cover'|'contain'|'fill'|'none'} Default: 'cover'
 *   status         {'online'|'offline'|'away'|'busy'|boolean|null}
 *   statusColor    {string}   Override status dot color
 *   statusAngle    {number}   Degrees from bottom toward right. Default: 30
 *   showStatus     {boolean}  Show status dot. Default: auto (true when status is provided)
 *   hover          {boolean}  Enable hover animation
 *   onClick        {function}
 *   onclick        {function}  Alias of onClick
 *   style          {object}
 *   class          {string}
 */
export function buildImageProfile(src, options = {}) {
  if (typeof src === 'object' && src !== null) {
    options = src
    src = options.src ?? ''
  }

  const {
    alt = '',
    name = '',
    size = 42,
    ring = '#8a8a8a',
    ringWidth = 0,
    fit = 'cover',
    status = null,
    statusColor,
    statusAngle = 30,
    showStatus,
    hover = false,
    onClick,
    onclick,
    style = {},
    class: className,
  } = options
  const handleClick = onClick ?? onclick

  const statusMap = {
    online: '#22c55e',
    offline: '#94a3b8',
    away: '#f59e0b',
    busy: '#ef4444',
  }
  const normalizedStatus = typeof status === 'boolean'
    ? (status ? 'online' : 'offline')
    : status
  const resolvedStatusColor = statusColor ?? statusMap[normalizedStatus] ?? '#22c55e'
  const dotSize = Math.max(8, Math.round(size * 0.2))
  const statusTheta = ((90 - statusAngle) * Math.PI) / 180
  const statusRadius = (size / 2) + Math.max(2, Math.round(dotSize * 0.35))
  const statusX = (size / 2) + (Math.cos(statusTheta) * statusRadius)
  const statusY = ((size / 2) + (Math.sin(statusTheta) * statusRadius)) - 10

  const shouldShowStatus = (showStatus ?? (status !== null && status !== undefined))

  const wrapperStyle = {
    position: 'relative',
    display: 'inline-flex',
    width: `${size}px`,
    height: `${size}px`,
    overflow: 'visible',
    cursor: handleClick ? 'pointer' : undefined,
    transition: hover ? 'transform 140ms ease' : undefined,
    ...style,
  }

  const fallbackNode = h('div', {
    style: {
      width: '100%',
      height: '100%',
      display: src ? 'none' : 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#585858',
      color: '#ffffff',
    },
  }, [
    buildIcon('user', {
      size: Math.max(16, Math.round(size * 0.48)),
      color: '#9c9c9c',
      stroke: 1.8,
    }),
  ])

  return h('div', {
    style: wrapperStyle,
    class: className,
    onClick: handleClick,
    onMouseenter: hover ? (e) => {
      e.currentTarget.style.transform = 'scale(1.02)'
      const avatarLayer = e.currentTarget.firstElementChild
      if (avatarLayer) avatarLayer.style.filter = 'brightness(0.55) saturate(0.9)'
    } : undefined,
    onMouseleave: hover ? (e) => {
      e.currentTarget.style.transform = ''
      const avatarLayer = e.currentTarget.firstElementChild
      if (avatarLayer) avatarLayer.style.filter = ''
    } : undefined,
  }, [
    h('div', {
      style: {
        width: '100%',
        height: '100%',
        borderRadius: '9999px',
        overflow: 'hidden',
        border: ringWidth > 0 ? `${ringWidth}px solid ${ring}` : undefined,
        boxSizing: 'border-box',
        transition: hover ? 'filter 140ms ease' : undefined,
      },
    }, [
      src ? h('img', {
        src,
        alt,
        style: {
          width: '100%',
          height: '100%',
          objectFit: fit,
          display: 'block',
        },
        onError: (e) => {
          e.currentTarget.style.display = 'none'
          const fallback = e.currentTarget.nextElementSibling
          if (fallback) fallback.style.display = 'inline-flex'
        },
      }) : null,
      fallbackNode,
    ]),
    shouldShowStatus ? h('span', {
      style: {
        position: 'absolute',
        left: `${statusX - (dotSize / 2)}px`,
        top: `${statusY - (dotSize / 2)}px`,
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        borderRadius: '9999px',
        background: resolvedStatusColor,
        border: '2px solid #ffffff',
        boxSizing: 'border-box',
      },
    }) : null,
  ])
}
