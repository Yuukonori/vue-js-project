import { ref } from 'vue'
import {
  buildButton,
  buildContentGrid,
  buildDateBoxContainer,
  buildDropdown,
  buildGrid,
  buildHeader,
  buildIcon,
  buildIconContainer,
  buildInput,
  buildText,
} from '../../ui/index.js'

/**
 * NewAssetsForm(user)
 * @param {{ name: string }} user
 */
export function NewAssetsForm(user) {
  return {
    name: 'NewAssetsForm',
    setup() {
      const type = ref('laptop')
      const assetNo = ref('')
      const serial = ref('')
      const useTimeYears = ref('')
      const purchaseDate = ref('')
      const expiredDate = ref('')
      const status = ref('available')
      const formError = ref('')
      const isSuccess = ref(false)
      const isSubmitting = ref(false)

      function resetForm() {
        type.value = 'laptop'
        assetNo.value = ''
        serial.value = ''
        useTimeYears.value = ''
        purchaseDate.value = ''
        expiredDate.value = ''
        status.value = 'available'
        formError.value = ''
      }

      function goBack() {
        if (typeof globalThis.__appNavigate === 'function') {
          globalThis.__appNavigate('/assets')
        }
      }

      async function submitForm() {
        isSubmitting.value = true
        formError.value = ''

        try {
          if (!assetNo.value.trim() || !type.value) {
            formError.value = 'Please fill Type and Asset No.'
            isSubmitting.value = false
            return
          }

          // Helper to convert mm/dd/yyyy to yyyy-mm-dd
          const toIso = (str) => {
            if (!str) return null
            const parts = str.split('/')
            if (parts.length === 3) return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`
            return str
          }

          // 1. DATA MAPPING (Connecting UI fields to Database columns)
          const mapping = {
            asset_id: assetNo.value.startsWith('#') ? assetNo.value : `#${assetNo.value}`,
            category: type.value.charAt(0).toUpperCase() + type.value.slice(1),
            serial_number: serial.value || 'N/A',
            service_years: parseFloat(useTimeYears.value) || 0,
            purchase_date: toIso(purchaseDate.value),
            warranty_expiry: toIso(expiredDate.value),
            status: status.value.toUpperCase(),
          }

          // 2. PAYLOAD (The final package sent to the server)
          const payload = mapping

          const res = await fetch('/api/assets/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })

          if (!res.ok) {
            const errData = await res.json()
            throw new Error(errData.error || 'Failed to save asset')
          }

          // Success - show dialog
          isSuccess.value = true

          // Wait 2 seconds then go back
          setTimeout(() => {
            goBack()
          }, 2000)
        } catch (err) {
          formError.value = err.message
          console.error('Submission error:', err)
        } finally {
          isSubmitting.value = false
        }
      }

      return {
        type,
        assetNo,
        serial,
        useTimeYears,
        purchaseDate,
        expiredDate,
        status,
        formError,
        resetForm,
        goBack,
        submitForm,
        isSuccess,
        isSubmitting,
        // Setters to avoid unwrap issues in render
        setType: (v) => { type.value = v },
        setAssetNo: (v) => { assetNo.value = v },
        setSerial: (v) => { serial.value = v },
        setUseTimeYears: (v) => { useTimeYears.value = v },
        setPurchaseDate: (v) => { purchaseDate.value = v },
        setExpiredDate: (v) => { expiredDate.value = v },
        setStatus: (v) => { status.value = v },
      }
    },
    render(Ruki) {
      function field(label, control, required = false) {
        return buildGrid({
          columns: 1,
          rows: 2,
          display: false,
          rowGap: 2,
          child: {
            1: buildText(required ? `${label} *` : label, { size: 'xs', weight: 'bold', color: 'gray700' }),
            2: control,
          },
        })
      }

      const content = buildContentGrid({
        columns: 6,
        rows: 3,
        padding: '16px',
        cellPadding: 0,
        colGap: 12,
        rowGap: 12,
        display: false,
        fillViewport: true,
        span: {
          1: { colSpan: 6, rowSpan: 2 },
          13: { colSpan: 6 },
        },
        child: {
          1: buildHeader({
            title: 'Register New Asset',
            subtitle: `Create new asset profile for ${user?.name || 'your team'}.`,
            titleOptions: { size: '2xl' },
            leftNode: buildIconContainer({
              icon: 'arrow-back',
              colorIcon: '#6366f1',
              colorCon: '#e0e7ff',
              size: '40',
              radius: '12px',
              containerStyle: 'square',
              hover: true,
              onPressed: Ruki.goBack,
            }),
            rightNode: buildGrid({
              columns: 3,
              rows: 1,
              display: false,
              colGap: 10,
              style: { minWidth: '400px' },
              child: {
                1: buildButton('Cancel', {
                  variant: 'outline',
                  color: 'neutral',
                  size: 'sm',
                  onPressed: Ruki.goBack,
                  style: { width: '100%', height: '34px', fontWeight: '700', borderColor: '#64748b' },
                }),
                2: buildButton('Reset', {
                  variant: 'link',
                  color: 'primary',
                  size: 'sm',
                  onPressed: Ruki.resetForm,
                  style: { width: '100%', height: '34px', fontWeight: '700', textDecoration: 'none' },
                }),
                3: buildButton('Save Asset', {
                  color: 'primary',
                  size: 'sm',
                  onPressed: Ruki.submitForm,
                  loading: Ruki.isSubmitting,
                  iconRight: buildIcon('arrow-right', { size: 14, color: '#ffffff' }),
                  style: { width: '100%', height: '34px', fontWeight: '700' },
                }),
              },
            }),
            backgroundColor: 'white',
            divider: false,
            padding: '16px 24px 12px',
            style: { margin: '-16px 0 0 -16px', width: 'calc(100% + 32px)' },
          }),
          13: buildGrid({
            columns: 3,
            rows: 4,
            display: true,
            padding: '16px',
            colGap: 16,
            rowGap: 16,
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            style: { height: 'fit-content' },
            span: { 10: { colSpan: 3 } },
            child: {
              1: field('Asset No.', buildInput({ placeholder: 'e.g. LAP-001', size: 'sm', full: true, value: Ruki.assetNo, onUpdate: Ruki.setAssetNo }), true),
              2: field('Type', buildDropdown({ placeholder: 'Select type', items: [{ text: 'Laptop', value: 'laptop' }, { text: 'Desktop', value: 'desktop' }, { text: 'Monitor', value: 'monitor' }, { text: 'Tablet', value: 'tablet' }], value: Ruki.type, onUpdate: Ruki.setType, width: '100%', height: '34px' }), true),
              3: field('Serial', buildInput({ placeholder: 'Serial number', size: 'sm', full: true, value: Ruki.serial, onUpdate: Ruki.setSerial })),
              4: field('Use Time (years)', buildInput({ placeholder: 'e.g. 4', size: 'sm', full: true, value: Ruki.useTimeYears, onUpdate: Ruki.setUseTimeYears })),
              5: field('Purchase Date', buildDateBoxContainer({ placeHolder: 'mm/dd/yyyy', value: Ruki.purchaseDate, width: '100%', height: '34px', color: '#6b7280', colorCon: '#ffffff', padding: '0 10px', borderRadius: '10px', border: '1px solid #e5e7eb', insert: true, textStyle: { fontSize: '13px' }, onUpdate: Ruki.setPurchaseDate })),
              6: field('Expired Date', buildDateBoxContainer({ placeHolder: 'mm/dd/yyyy', value: Ruki.expiredDate, width: '100%', height: '34px', color: '#6b7280', colorCon: '#ffffff', padding: '0 10px', borderRadius: '10px', border: '1px solid #e5e7eb', insert: true, textStyle: { fontSize: '13px' }, onUpdate: Ruki.setExpiredDate })),
              7: field('Status', buildDropdown({ placeholder: 'Select status', items: [{ text: 'Available', value: 'available' }, { text: 'Assigned', value: 'assigned' }, { text: 'Maintenance', value: 'maintenance' }], value: Ruki.status, onUpdate: Ruki.setStatus, width: '100%', height: '34px' })),
              10: Ruki.formError
                ? buildText(Ruki.formError, { size: 'xs', color: '#dc2626', weight: 'bold' })
                : buildText('', { size: 'xs', color: 'transparent' }),
            },
          }),
        },
      })

      if (!Ruki.isSuccess) return content

      // Overlay Dialog
      return buildGrid({
        columns: 1,
        rows: 1,
        display: true,
        fillViewport: true,
        backgroundColor: 'rgba(15, 23, 42, 0.40)',
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        child: {
          1: buildGrid({
            columns: 1,
            rows: 3,
            padding: '40px',
            borderRadius: '24px',
            backgroundColor: '#ffffff',
            style: { width: '400px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
            rowGap: 20,
            child: {
              1: buildIconContainer({
                icon: 'check-circle',
                colorIcon: '#10b981',
                colorCon: '#d1fae5',
                size: '80',
                radius: '50%',
                containerStyle: 'square',
                style: { margin: '0 auto' }
              }),
              2: buildText('Success!', { size: '3xl', weight: 'bold', color: '#111827' }),
              3: buildText('Asset successfully registered to inventory.', { size: 'md', color: '#4b5563' }),
            }
          })
        }
      })
    },
  }
}
