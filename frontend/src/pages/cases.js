import { defineComponent, h } from 'vue'
import { buildContentGrid, buildGrid, buildText, buildIconText } from '../ui/index.js'

export function CasesPage() {
  return {
    name: 'CasesPage',
    setup() {
      return () => buildContentGrid({
        columns: 1,
        rows: 2,
        padding: '24px',
        rowGap: 12,
        display: false,
        child: {
          1: buildIconText('Cases', {
            icon: 'clipboard',
            iconSize: 28,
            iconColor: 'primary',
            textSize: '2xl',
            textWeight: 'bold',
            textColor: 'gray800',
          }),
          2: buildGrid({
            columns: 1,
            rows: 1,
            display: true,
            padding: '18px',
            border: '1px solid #e2e8f0',
            radius: 12,
            backgroundColor: '#ffffff',
            child: {
              1: buildText('Cases page is ready. You can plug ticket/case workflow here.', { size: 'base', color: 'gray600' }),
            },
          }),
        },
      })
    }
  }
}
