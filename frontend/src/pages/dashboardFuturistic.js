import { h, defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { 
  buildIcon,
  buildMetricCard,
  buildExpiringAssetCard,
  buildPromoCard,
  buildFuturisticTable,
  buildSearchBar,
} from '../ui/index.js'

/**
 * Futuristic Dashboard Page with Real-time Updates
 */
export function DashboardFuturistic(user) {
  return defineComponent({
    name: 'DashboardFuturistic',
    
    setup() {
      // Reactive state for real-time data
      const serverUptime = ref({ hours: 1, minutes: 57, seconds: 14 })
      const networkLatency = ref(10)
      const securityScore = ref(98)
      const activeAlerts = ref(2)
      
      // Intervals for real-time updates
      let uptimeInterval = null
      let latencyInterval = null
      
      // Update server uptime every second
      const updateUptime = () => {
        serverUptime.value.seconds++
        if (serverUptime.value.seconds >= 60) {
          serverUptime.value.seconds = 0
          serverUptime.value.minutes++
        }
        if (serverUptime.value.minutes >= 60) {
          serverUptime.value.minutes = 0
          serverUptime.value.hours++
        }
      }
      
      // Simulate network latency fluctuation
      const updateLatency = () => {
        // Random latency between 8ms and 15ms
        networkLatency.value = Math.floor(Math.random() * 8) + 8
      }
      
      // Format uptime
      const formatUptime = () => {
        const h = String(serverUptime.value.hours).padStart(1, '0')
        const m = String(serverUptime.value.minutes).padStart(2, '0')
        const s = String(serverUptime.value.seconds).padStart(2, '0')
        return `${h}h ${m}m ${s}s`
      }
      
      // Calculate time ago
      const getTimeAgo = (hoursAgo) => {
        if (hoursAgo < 1) return `${Math.floor(hoursAgo * 60)}m ago`
        if (hoursAgo < 24) return `${Math.floor(hoursAgo)}h ago`
        return `${Math.floor(hoursAgo / 24)}d ago`
      }
      
      // Ticket times that update
      const ticketTimes = ref([
        { id: '#12348', time: 1 },
        { id: '#12347', time: 3 },
        { id: '#12346', time: 24 },
        { id: '#12345', time: 48 },
      ])
      
      // Start real-time updates
      onMounted(() => {
        uptimeInterval = setInterval(updateUptime, 1000)
        latencyInterval = setInterval(updateLatency, 2000)
        
        // Update ticket times every minute
        setInterval(() => {
          ticketTimes.value = ticketTimes.value.map(t => ({
            ...t,
            time: t.time + (1/60) // Add 1 minute
          }))
        }, 60000)
      })
      
      // Cleanup intervals
      onUnmounted(() => {
        if (uptimeInterval) clearInterval(uptimeInterval)
        if (latencyInterval) clearInterval(latencyInterval)
      })
      
      return () => {
        // Create component instances with reactive data
        const searchBar = buildSearchBar({
          placeholder: 'Search anything...',
          onSearch: (value) => console.log('Search:', value)
        })
        
        const metricCard1 = buildMetricCard({
          icon: 'server',
          iconColor: '#60a5fa',
          iconBg: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.3))',
          title: 'Server Uptime',
          value: formatUptime(),
          subtitle: 'Last 24 hours',
          status: '99.99%',
          statusColor: '#10b981',
          showChart: true,
          chartColor: '#60a5fa',
        })
        
        const metricCard2 = buildMetricCard({
          icon: 'zap',
          iconColor: '#a78bfa',
          iconBg: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(139, 92, 246, 0.3))',
          title: 'Network Latency',
          value: `${networkLatency.value}ms`,
          subtitle: 'Average Response',
          status: 'Stable',
          statusColor: '#60a5fa',
          showChart: true,
          chartColor: '#a78bfa',
        })
        
        const metricCard3 = buildMetricCard({
          icon: 'shield',
          iconColor: '#10b981',
          iconBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
          title: 'Security Score',
          value: `${securityScore.value} / 100`,
          subtitle: 'Very Secure',
          status: 'Stable',
          statusColor: '#10b981',
          showChart: true,
          chartColor: '#10b981',
        })
        
        const metricCard4 = buildMetricCard({
          icon: 'alert-triangle',
          iconColor: '#f59e0b',
          iconBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.3))',
          title: 'Active Alerts',
          value: String(activeAlerts.value),
          subtitle: 'Requires Attention',
          status: 'Warning',
          statusColor: '#f59e0b',
          showChart: true,
          chartColor: '#f59e0b',
        })
        
        const assetCard1 = buildExpiringAssetCard({
          icon: 'printer',
          title: 'Printer Laser Jett',
          daysLeft: 2,
          urgency: 'urgent',
        })
        
        const assetCard2 = buildExpiringAssetCard({
          icon: 'wifi',
          title: 'Cisco Edge Switch',
          daysLeft: 24,
          urgency: 'warning',
        })
        
        const assetCard3 = buildExpiringAssetCard({
          icon: 'laptop',
          title: 'MacBook Pro M2',
          daysLeft: 12,
          urgency: 'warning',
        })
        
        const assetCard4 = buildExpiringAssetCard({
          icon: 'monitor',
          title: 'HP Monitor 24"',
          daysLeft: 8,
          urgency: 'normal',
        })
        
        const ticketsTable = buildFuturisticTable({
          headers: ['TICKET ID', 'SUBJECT', 'STATUS', 'PRIORITY', 'UPDATED'],
          rows: [
            [
              h('span', { style: { color: '#60a5fa', fontWeight: '600' } }, ticketTimes.value[0].id),
              'Software Update Failure',
              h('span', { 
                style: { 
                  padding: '4px 12px', 
                  borderRadius: '8px', 
                  background: 'rgba(239, 68, 68, 0.2)', 
                  border: '1px solid rgba(239, 68, 68, 0.4)', 
                  color: '#f87171',
                  fontSize: '12px',
                  fontWeight: '600',
                } 
              }, 'URGENT'),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
                h('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' } }),
                h('span', {}, 'High')
              ]),
              getTimeAgo(ticketTimes.value[0].time),
            ],
            [
              h('span', { style: { color: '#60a5fa', fontWeight: '600' } }, ticketTimes.value[1].id),
              'Cloud Sync Error',
              h('span', { 
                style: { 
                  padding: '4px 12px', 
                  borderRadius: '8px', 
                  background: 'rgba(59, 130, 246, 0.2)', 
                  border: '1px solid rgba(59, 130, 246, 0.4)', 
                  color: '#60a5fa',
                  fontSize: '12px',
                  fontWeight: '600',
                } 
              }, 'PENDING'),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
                h('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' } }),
                h('span', {}, 'Medium')
              ]),
              getTimeAgo(ticketTimes.value[1].time),
            ],
            [
              h('span', { style: { color: '#60a5fa', fontWeight: '600' } }, ticketTimes.value[2].id),
              'Keyboard Replacement',
              h('span', { 
                style: { 
                  padding: '4px 12px', 
                  borderRadius: '8px', 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  border: '1px solid rgba(16, 185, 129, 0.4)', 
                  color: '#34d399',
                  fontSize: '12px',
                  fontWeight: '600',
                } 
              }, 'RESOLVED'),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
                h('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' } }),
                h('span', {}, 'Low')
              ]),
              getTimeAgo(ticketTimes.value[2].time),
            ],
            [
              h('span', { style: { color: '#60a5fa', fontWeight: '600' } }, ticketTimes.value[3].id),
              'Display flicker - User A.smith',
              h('span', { 
                style: { 
                  padding: '4px 12px', 
                  borderRadius: '8px', 
                  background: 'rgba(167, 139, 250, 0.2)', 
                  border: '1px solid rgba(167, 139, 250, 0.4)', 
                  color: '#a78bfa',
                  fontSize: '12px',
                  fontWeight: '600',
                } 
              }, 'IN PROGRESS'),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
                h('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' } }),
                h('span', {}, 'Medium')
              ]),
              getTimeAgo(ticketTimes.value[3].time),
            ],
          ],
          onRowClick: (row) => console.log('Row clicked:', row)
        })
        
        const promoCard = buildPromoCard({
          title: 'Keep Your Systems Running Smoothly',
          description: 'Regular maintenance and updates help prevent future issues.',
          buttonText: 'View Maintenance Schedule',
          gradient: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(167, 139, 250, 0.3))',
          icon: 'shield-check',
          onClick: () => console.log('Promo clicked')
        })
        
        return h('div', {
          style: {
            padding: '40px',
            maxWidth: '1600px',
            margin: '0 auto',
          }
        }, [
          // Header Section
          h('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
            }
          }, [
            // Welcome message
            h('div', {}, [
              h('h1', {
                style: {
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }
              }, [
                `Welcome back, ${user.name}!`,
                h('span', { style: { fontSize: '28px' } }, '👋')
              ]),
              h('p', {
                style: {
                  fontSize: '14px',
                  color: 'rgba(226, 232, 240, 0.6)',
                }
              }, "Here's what's happening with your systems today.")
            ]),
            
            // Right side controls
            h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }
            }, [
              // Search bar
              h(searchBar),
              
              // Notification bell
              h('div', {
                style: {
                  position: 'relative',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(96, 165, 250, 0.1)',
                  border: '1px solid rgba(96, 165, 250, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                },
                onMouseenter: (e) => {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.2)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                },
                onMouseleave: (e) => {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)'
                  e.currentTarget.style.transform = 'scale(1)'
                },
              }, [
                buildIcon('bell', { size: 20, color: '#60a5fa' }),
                // Badge
                h('div', {
                  style: {
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
                  }
                })
              ]),
              
              // Status indicator
              h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }
              }, [
                h('div', {
                  style: {
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }
                }),
                h('span', {
                  style: {
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#10b981',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }
                }, 'ALL SYSTEM OPERATIONAL')
              ])
            ])
          ]),
          
          // Main Content Grid - Two Column Layout
          h('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: '1fr 350px',
              gap: '24px',
              marginBottom: '32px',
            }
          }, [
            // Left Column - System Overview
            h('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }
            }, [
              // System Overview Header
              h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }
              }, [
                h('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }
                }, [
                  buildIcon('activity', { size: 24, color: '#60a5fa' }),
                  h('h2', {
                    style: {
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#ffffff',
                    }
                  }, 'System Overview')
                ]),
                h('button', {
                  style: {
                    padding: '10px 20px',
                    background: 'rgba(96, 165, 250, 0.1)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    borderRadius: '12px',
                    color: '#60a5fa',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                  },
                  onMouseenter: (e) => {
                    e.currentTarget.style.background = 'rgba(96, 165, 250, 0.2)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  },
                  onMouseleave: (e) => {
                    e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  },
                }, [
                  'View Network Map',
                  buildIcon('arrow-right', { size: 16, color: '#60a5fa' })
                ])
              ]),
              
              // 4 Metric Cards in a Row
              h('div', {
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                }
              }, [
                h(metricCard1),
                h(metricCard2),
                h(metricCard3),
                h(metricCard4),
              ]),
            ]),
            
            // Right Column - Expiring Assets
            h('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }
            }, [
              // Expiring Assets Header
              h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }
              }, [
                buildIcon('calendar', { size: 24, color: '#a78bfa' }),
                h('h2', {
                  style: {
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                  }
                }, 'Expiring Assets')
              ]),
              
              // Expiring Assets List
              h('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }
              }, [
                h(assetCard1),
                h(assetCard2),
                h(assetCard3),
                h(assetCard4),
              ]),
            ]),
          ]),
          
          // Recent Repair Tickets Section
          h('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: '1fr 350px',
              gap: '24px',
              marginBottom: '32px',
            }
          }, [
            // Tickets table
            h('div', {}, [
              h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }
              }, [
                h('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }
                }, [
                  buildIcon('clipboard', { size: 24, color: '#60a5fa' }),
                  h('h2', {
                    style: {
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#ffffff',
                    }
                  }, 'Recent Repair Tickets')
                ]),
                h('button', {
                  style: {
                    padding: '10px 20px',
                    background: 'transparent',
                    border: 'none',
                    color: '#60a5fa',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                  },
                  onMouseenter: (e) => {
                    e.currentTarget.style.color = '#a78bfa'
                  },
                  onMouseleave: (e) => {
                    e.currentTarget.style.color = '#60a5fa'
                  },
                }, [
                  'View All Tickets',
                  buildIcon('arrow-right', { size: 16, color: 'currentColor' })
                ])
              ]),
              
              h(ticketsTable)
            ]),
            
            // Promo card
            h(promoCard)
          ])
        ])
      }
    }
  })
}
