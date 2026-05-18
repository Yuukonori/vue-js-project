import { ref, h, computed, onMounted } from 'vue'
import {
  buildButton,
  buildContentGrid,
  buildGrid,
  buildHeader,
  buildIcon,
  buildIconContainer,
  buildInput,
  buildText,
  buildDropdown,
} from '../../ui/index.js'

export function MaintenanceFormPage(user) {
  return {
    name: 'MaintenanceFormPage',
    setup() {
      const isSuccess = ref(false)
      const formError = ref('')
      const isSubmitting = ref(false)

      const assets = ref([])
      const selectedAssetId = ref(null)
      const issue = ref('')
      const priority = ref('MEDIUM')
      const actionText = ref('')

      async function fetchAssets() {
        try {
          const res = await fetch('/api/conn_1778809328809/inventory/showAssets')
          if (!res.ok) throw new Error(`Failed to fetch assets: ${res.status}`)
          const body = await res.json()
          const rawData = Array.isArray(body) ? body : (body.data || [])
          assets.value = rawData.map(a => ({
            id: a.asset_id,
            name: `${a.category} #${a.asset_id} (${a.serial_number})`
          }))
          if (assets.value.length > 0) {
            selectedAssetId.value = assets.value[0].id
          }
        } catch (err) {
          console.error('Failed to fetch assets for maintenance form:', err)
          assets.value = []
        }
      }

      const assetOptions = computed(() => {
        return assets.value.map(a => ({ text: a.name, value: a.id }))
      })

      const priorityOptions = [
        { text: 'Low', value: 'LOW' },
        { text: 'Medium', value: 'MEDIUM' },
        { text: 'High', value: 'HIGH' },
        { text: 'Critical', value: 'CRITICAL' },
      ]

      function goBack() {
        if (typeof globalThis.__appNavigate === 'function') {
          globalThis.__appNavigate('/monitoring')
        }
      }

      async function submitForm() {
        if (isSubmitting.value) return
        isSubmitting.value = true
        formError.value = ''

        if (!selectedAssetId.value) {
          formError.value = 'Please select an asset.'
          isSubmitting.value = false
          return
        }

        if (!issue.value.trim()) {
          formError.value = 'Please describe the issue.'
          isSubmitting.value = false
          return
        }

        if (!actionText.value.trim()) {
          formError.value = 'Please specify the maintenance action required.'
          isSubmitting.value = false
          return
        }

        try {
          const res = await fetch('/api/conn_1778809328809/maintenance/addMaintenance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              asset_id: Number(selectedAssetId.value),
              issue: issue.value.trim(),
              priority: priority.value,
              action_text: actionText.value.trim(),
            }),
          })

          if (!res.ok) {
            const errBody = await res.json().catch(() => ({}))
            throw new Error(errBody?.error || `Failed to submit: ${res.status}`)
          }

          isSuccess.value = true
          setTimeout(goBack, 2000)
        } catch (err) {
          console.error('Failed to submit maintenance task:', err)
          formError.value = err.message || 'An error occurred during submission.'
        } finally {
          isSubmitting.value = false
        }
      }

      onMounted(async () => {
        await fetchAssets()
      })

      return {
        isSuccess,
        formError,
        isSubmitting,
        assetOptions,
        selectedAssetId,
        issue,
        priority,
        priorityOptions,
        actionText,
        goBack,
        submitForm,
      }
    },
    render(Ruki) {
      if (Ruki.isSuccess) {
        return buildGrid({
          columns: 1, rows: 1, display: true, fillViewport: true,
          backgroundColor: 'rgba(15, 23, 42, 0.40)',
          style: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
          child: {
            1: buildGrid({
              columns: 1, rows: 3, padding: '40px', borderRadius: '24px', backgroundColor: '#ffffff',
              style: { width: '400px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
              rowGap: 20,
              child: {
                1: buildIconContainer({ icon: 'circle-check', colorIcon: '#10b981', colorCon: '#d1fae5', size: '80', radius: '50%', containerStyle: 'square', style: { margin: '0 auto' } }),
                2: buildText('Success!', { size: '3xl', weight: 'bold', color: '#111827' }),
                3: buildText('Critical maintenance task successfully registered.', { size: 'md', color: '#4b5563' }),
              }
            })
          }
        })
      }

      function field(label, control, required = false) {
        return buildGrid({
          columns: 1, rows: 2, display: false, rowGap: 2,
          child: {
            1: buildText(required ? `${label} *` : label, { size: 'xs', weight: 'bold', color: 'gray700', style: { marginLeft: '10px' } }),
            2: control,
          },
        })
      }

      return buildContentGrid({
        columns: 6, rows: 2, padding: '24px', cellPadding: 0, colGap: 12, rowGap: 12, display: false, fillViewport: true,
        span: { 1: { colSpan: 6, rowSpan: 1 }, 7: { colSpan: 6 } },
        child: {
          1: buildHeader({
            title: 'Schedule Critical Maintenance',
            subtitle: 'Register urgent hardware maintenance or diagnostic tasks.',
            titleOptions: { size: '4xl' },
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
            actionText: Ruki.isSubmitting ? 'Submitting...' : 'Register',
            actionIcon: buildIcon('plus', { size: '18', color: 'white' }),
            onAction: Ruki.submitForm,
            actionStyle: { width: '120px', height: '40px', borderRadius: '12px', gap: '8px' },
            backgroundColor: 'transparent',
            divider: false,
            padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          7: buildGrid({
            columns: 2, rows: 3, display: true, padding: '40px', colGap: 24, rowGap: 24, borderRadius: '24px', border: '1px solid #eef2f6', backgroundColor: '#ffffff',
            span: {
              1: { colSpan: 1 }, 2: { colSpan: 1 },
              3: { colSpan: 2 },
              5: { colSpan: 2 },
            },
            child: {
              1: field('Select Asset', buildDropdown({
                placeholder: 'Select asset',
                items: Ruki.assetOptions.value || Ruki.assetOptions,
                value: Ruki.selectedAssetId,
                onUpdate: (v) => { Ruki.selectedAssetId = v },
                width: '100%',
                height: '38px',
                style: { border: 'none', backgroundColor: '#f1f5f9' },
              }), true),
              2: field('Priority Level', buildDropdown({
                placeholder: 'Select priority',
                items: Ruki.priorityOptions,
                value: Ruki.priority,
                onUpdate: (v) => { Ruki.priority = v },
                width: '100%',
                height: '38px',
                style: { border: 'none', backgroundColor: '#f1f5f9' },
              }), true),
              3: field('Reported Issue', buildInput({
                placeholder: 'Describe the hardware problem or failure symptomatology...',
                value: Ruki.issue,
                onUpdate: (v) => { Ruki.issue = v },
                style: { width: '100%', border: 'none', backgroundColor: '#f1f5f9', borderRadius: '10px', height: '44px', padding: '0 12px' },
              }), true),
              5: field('Maintenance Action Required', buildInput({
                placeholder: 'Specify diagnostic protocols or action items required (e.g. replace battery, clean fans)...',
                value: Ruki.actionText,
                onUpdate: (v) => { Ruki.actionText = v },
                style: { width: '100%', border: 'none', backgroundColor: '#f1f5f9', borderRadius: '10px', height: '44px', padding: '0 12px' },
              }), true),
              7: Ruki.formError ? buildText(Ruki.formError, { size: 'sm', weight: 'bold', color: 'red600', style: { padding: '8px 0' } }) : null,
            }
          }),
        },
      })
    },
  }
}
