import { h } from 'vue'
import { buildIcon } from './icon.js'

/**
 * buildMetricCard - Futuristic metric card with gradient icon and mini chart
 */
export function buildMetricCard(options = {}) {
  const {
    icon = 'activity',
    iconColor = '#60a5fa',
    iconBg = 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.3))',
    title = 'Metric',
    value = '0',
    subtitle = 'Description',
    status = 'Stable',
    statusColor = '#10b981',
    showChart = true,
    chartColor = '#60a5fa',
  } = options

  return {
    render() {
      return h('div', {
        style: {
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(96, 165, 250, 0.2)',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        },
        onMouseenter: (e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.4)'
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(96, 165, 250, 0.3)'
        },
        onMouseleave: (e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.2)'
          e.currentTarget.style.boxShadow = 'none'
        },
      }, [
        // Header with icon and status
        h('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }
        }, [
          // Icon
          h('div', {
            style: {
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${iconColor}40`,
            }
          }, [
            buildIcon(icon, { size: 28, color: iconColor })
          ]),
          // Status badge
          h('div', {
            style: {
              padding: '6px 12px',
              borderRadius: '8px',
              background: `${statusColor}20`,
              border: `1px solid ${statusColor}40`,
              color: statusColor,
              fontSize: '12px',
              fontWeight: '600',
            }
          }, status),
        ]),
        
        // Title
        h('div', {
          style: {
            fontSize: '14px',
            color: 'rgba(226, 232, 240, 0.7)',
            fontWeight: '500',
          }
        }, title),
        
        // Value
        h('div', {
          style: {
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }
        }, value),
        
        // Subtitle
        h('div', {
          style: {
            fontSize: '12px',
            color: 'rgba(226, 232, 240, 0.5)',
          }
        }, subtitle),
        
        // Mini chart (SVG wave)
        showChart && h('svg', {
          viewBox: '0 0 200 40',
          style: {
            width: '100%',
            height: '40px',
            marginTop: '8px',
          }
        }, [
          h('path', {
            d: 'M0,20 Q10,10 20,15 T40,20 T60,18 T80,22 T100,20 T120,16 T140,20 T160,18 T180,20 T200,18',
            fill: 'none',
            stroke: chartColor,
            'stroke-width': '2',
            opacity: '0.6',
          }),
          h('path', {
            d: 'M0,20 Q10,10 20,15 T40,20 T60,18 T80,22 T100,20 T120,16 T140,20 T160,18 T180,20 T200,18 L200,40 L0,40 Z',
            fill: `url(#gradient-${icon})`,
            opacity: '0.2',
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: `gradient-${icon}`,
              x1: '0%',
              y1: '0%',
              x2: '0%',
              y2: '100%',
            }, [
              h('stop', { offset: '0%', 'stop-color': chartColor, 'stop-opacity': '0.4' }),
              h('stop', { offset: '100%', 'stop-color': chartColor, 'stop-opacity': '0' }),
            ])
          ])
        ]),
      ])
    }
  }
}

/**
 * buildExpiringAssetCard - Card for expiring assets with icon and countdown
 */
export function buildExpiringAssetCard(options = {}) {
  const {
    icon = 'box',
    iconColor = '#a78bfa',
    title = 'Asset Name',
    daysLeft = 0,
    urgency = 'normal', // 'urgent', 'warning', 'normal'
  } = options

  const urgencyColors = {
    urgent: { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.4)', text: '#f87171' },
    warning: { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24' },
    normal: { bg: 'rgba(96, 165, 250, 0.2)', border: 'rgba(96, 165, 250, 0.4)', text: '#60a5fa' },
  }

  const colors = urgencyColors[urgency] || urgencyColors.normal

  return {
    render() {
      return h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.4))',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        },
        onMouseenter: (e) => {
          e.currentTarget.style.transform = 'translateX(4px)'
          e.currentTarget.style.boxShadow = `0 4px 16px ${colors.border}`
        },
        onMouseleave: (e) => {
          e.currentTarget.style.transform = 'translateX(0)'
          e.currentTarget.style.boxShadow = 'none'
        },
      }, [
        // Icon
        h('div', {
          style: {
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: '0',
          }
        }, [
          buildIcon(icon, { size: 24, color: colors.text })
        ]),
        
        // Content
        h('div', {
          style: {
            flex: '1',
            minWidth: '0',
          }
        }, [
          h('div', {
            style: {
              fontSize: '14px',
              fontWeight: '600',
              color: '#e2e8f0',
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }
          }, title),
          h('div', {
            style: {
              fontSize: '12px',
              color: 'rgba(226, 232, 240, 0.6)',
            }
          }, `EXPIRING IN ${daysLeft} DAYS`),
        ]),
        
        // Days badge
        h('div', {
          style: {
            padding: '6px 12px',
            borderRadius: '8px',
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            color: colors.text,
            fontSize: '14px',
            fontWeight: '700',
            flexShrink: '0',
          }
        }, `${daysLeft} DAYS`),
        
        // Arrow
        h('div', {
          style: {
            color: 'rgba(226, 232, 240, 0.4)',
            flexShrink: '0',
          }
        }, [
          buildIcon('chevron-right', { size: 16, color: 'rgba(226, 232, 240, 0.4)' })
        ]),
      ])
    }
  }
}

/**
 * buildPromoCard - Promotional card with gradient background
 */
export function buildPromoCard(options = {}) {
  const {
    title = 'Promo Title',
    description = 'Description text',
    buttonText = 'Learn More',
    gradient = 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(167, 139, 250, 0.3))',
    icon = 'star',
    onClick = () => {},
  } = options

  return {
    render() {
      return h('div', {
        style: {
          background: gradient,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(96, 165, 250, 0.3)',
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        },
        onClick,
        onMouseenter: (e) => {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.boxShadow = '0 16px 64px rgba(96, 165, 250, 0.3)'
        },
        onMouseleave: (e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        },
      }, [
        // Decorative icon
        h('div', {
          style: {
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            opacity: '0.1',
          }
        }, [
          buildIcon(icon, { size: 120, color: '#ffffff' })
        ]),
        
        // Title
        h('div', {
          style: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#ffffff',
            position: 'relative',
            zIndex: '1',
          }
        }, title),
        
        // Description
        h('div', {
          style: {
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.6',
            position: 'relative',
            zIndex: '1',
          }
        }, description),
        
        // Button
        h('button', {
          style: {
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            alignSelf: 'flex-start',
            position: 'relative',
            zIndex: '1',
          },
          onMouseenter: (e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          },
          onMouseleave: (e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.transform = 'translateY(0)'
          },
        }, [
          buttonText,
          ' ',
          buildIcon('arrow-right', { size: 16, color: '#ffffff' })
        ]),
      ])
    }
  }
}

/**
 * buildFuturisticTable - Enhanced table with better styling
 */
export function buildFuturisticTable(options = {}) {
  const {
    headers = [],
    rows = [],
    onRowClick = () => {},
  } = options

  return {
    render() {
      return h('div', {
        style: {
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(96, 165, 250, 0.2)',
          borderRadius: '24px',
          overflow: 'hidden',
        }
      }, [
        h('table', {
          style: {
            width: '100%',
            borderCollapse: 'collapse',
          }
        }, [
          // Header
          h('thead', {}, [
            h('tr', {
              style: {
                background: 'rgba(96, 165, 250, 0.1)',
                borderBottom: '1px solid rgba(96, 165, 250, 0.2)',
              }
            }, headers.map(header => 
              h('th', {
                style: {
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'rgba(226, 232, 240, 0.7)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }
              }, header)
            ))
          ]),
          
          // Body
          h('tbody', {}, rows.map((row, idx) =>
            h('tr', {
              key: idx,
              style: {
                borderBottom: idx < rows.length - 1 ? '1px solid rgba(96, 165, 250, 0.1)' : 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              },
              onClick: () => onRowClick(row),
              onMouseenter: (e) => {
                e.currentTarget.style.background = 'rgba(96, 165, 250, 0.05)'
              },
              onMouseleave: (e) => {
                e.currentTarget.style.background = 'transparent'
              },
            }, row.map(cell =>
              h('td', {
                style: {
                  padding: '16px 20px',
                  fontSize: '14px',
                  color: '#e2e8f0',
                }
              }, cell)
            ))
          ))
        ])
      ])
    }
  }
}

/**
 * buildSearchBar - Futuristic search bar
 */
export function buildSearchBar(options = {}) {
  const {
    placeholder = 'Search anything...',
    onSearch = () => {},
  } = options

  return {
    render() {
      return h('div', {
        style: {
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
        }
      }, [
        h('input', {
          type: 'text',
          placeholder,
          style: {
            width: '100%',
            padding: '12px 16px 12px 48px',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(96, 165, 250, 0.2)',
            borderRadius: '12px',
            color: '#e2e8f0',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease',
          },
          onFocus: (e) => {
            e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.2)'
          },
          onBlur: (e) => {
            e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.2)'
            e.currentTarget.style.boxShadow = 'none'
          },
          onInput: (e) => onSearch(e.target.value),
        }),
        h('div', {
          style: {
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }
        }, [
          buildIcon('search', { size: 18, color: 'rgba(226, 232, 240, 0.5)' })
        ]),
      ])
    }
  }
}
