import { ref, onMounted, watch, computed, h, defineComponent } from 'vue'
import {
  buildButton,
  buildGrid,
  buildIcon,
  buildInput,
  buildText,
  buildDropdown,
  buildDateBoxContainer,
} from '../../ui/index.js'

/**
 * AssetForm component
 * Props:
 *  mode: 'create' | 'edit'
 *  initialData: object (for edit mode)
 *  onSuccess: function (called with result)
 *  onCancel: function
 */
export const AssetForm = defineComponent({
  name: 'AssetForm',
  props: {
    mode: { type: String, default: 'create' },
    initialData: { type: Object, default: null },
    onSuccess: { type: Function },
    onCancel: { type: Function },
    onDelete: { type: Function },
    assignItems: { type: Array, default: () => [] },
    assignedOwner: { default: null },
    onAssignedOwnerUpdate: { type: Function, default: null },
    canManageAssets: { type: Boolean, default: false },
  },
  setup(props, { expose }) {
    const type = ref('laptop')
    const assetNo = ref('')
    const serial = ref('')
    const useTimeYears = ref('')
    const purchaseDate = ref('')
    const expiredDate = ref('')
    const status = ref('available')
    const formError = ref('')
    const isSubmitting = ref(false)
    const isDeleting = ref(false)
    const assignedOwner = ref(props.assignedOwner)

    const fromIso = (isoStr) => {
      if (!isoStr) return ''
      const date = new Date(isoStr)
      if (isNaN(date.getTime())) return isoStr
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`
    }

    onMounted(() => {
      if (props.initialData) {
        type.value = props.initialData.category?.toLowerCase() || 'laptop'
        assetNo.value = String(props.initialData.asset_id || '').replace('#', '') || ''
        serial.value = props.initialData.serial_number || ''
        useTimeYears.value = props.initialData.service_years?.toString() || ''
        purchaseDate.value = fromIso(props.initialData.purchase_date)
        expiredDate.value = fromIso(props.initialData.warranty_expiry)
        status.value = props.initialData.status?.toLowerCase() || 'available'
      }
      assignedOwner.value = props.assignedOwner
    })

    watch(() => props.assignedOwner, (next) => {
      assignedOwner.value = next
    })

    async function submitForm() {
      isSubmitting.value = true
      formError.value = ''

      try {
        if (!assetNo.value.trim() || !type.value) {
          formError.value = 'Please fill Type and Asset No.'
          isSubmitting.value = false
          return
        }

        const toIso = (str) => {
          if (!str) return null
          const parts = str.split('/')
          if (parts.length === 3) return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`
          return str
        }

        const payload = props.mode === 'edit'
          ? {
              asset_id: props.initialData.asset_id,
              category: type.value.charAt(0).toUpperCase() + type.value.slice(1),
              serial_number: serial.value || 'N/A',
              service_years: parseFloat(useTimeYears.value) || 0,
              purchase_date: toIso(purchaseDate.value),
              warranty_expiry: toIso(expiredDate.value),
              status: status.value.toUpperCase(),
              assigned_user_id: assignedOwner.value == null ? null : Number(assignedOwner.value),
            }
          : {
              asset_id: assetNo.value,
              category: type.value.charAt(0).toUpperCase() + type.value.slice(1),
              serial_number: serial.value || 'N/A',
              service_years: parseFloat(useTimeYears.value) || 0,
              purchase_date: toIso(purchaseDate.value),
              warranty_expiry: toIso(expiredDate.value),
              status: status.value.toUpperCase(),
              assigned_user_id: assignedOwner.value == null ? null : Number(assignedOwner.value),
            }

        const url = props.mode === 'edit'
          ? '/api/conn_1778809328809/inventory/updateAssets'
          : '/api/conn_1778809328809/inventory/newAssets'
        const method = props.mode === 'edit' ? 'PATCH' : 'POST'

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const text = await res.text()
        const data = text ? JSON.parse(text) : {}
        if (!res.ok) {
          throw new Error(data.error || `Server error: ${res.status}`)
        }
        props.onSuccess?.(data)
      } catch (err) {
        formError.value = err.message
        console.error('Submission error:', err)
      } finally {
        isSubmitting.value = false
      }
    }

    async function deleteAsset() {
      if (!props.initialData?.asset_id) return

      isDeleting.value = true
      try {
        const res = await fetch('/api/conn_1778809328809/inventory/deleteAssets', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ asset_id: props.initialData.asset_id })
        })

        const text = await res.text()
        const data = text ? JSON.parse(text) : {}
        if (!res.ok) {
          throw new Error(data.error || `Server error: ${res.status}`)
        }
        props.onSuccess?.({ deleted: true, asset_id: props.initialData.asset_id })
      } catch (err) {
        formError.value = err.message
        console.error('Delete error:', err)
      } finally {
        isDeleting.value = false
      }
    }

    const onDeleteClick = () => {
      if (props.onDelete) {
        props.onDelete()
      } else {
        deleteAsset()
      }
    }

    const state = {
      type, assetNo, serial, useTimeYears, purchaseDate, expiredDate, status,
      formError, isSubmitting, isDeleting, assignedOwner,
      submitForm, deleteAsset, onDeleteClick,
      setType: (v) => { type.value = v },
      setAssetNo: (v) => { assetNo.value = v },
      setSerial: (v) => { serial.value = v },
      setUseTimeYears: (v) => { useTimeYears.value = v },
      setPurchaseDate: (v) => { purchaseDate.value = v },
      setExpiredDate: (v) => { expiredDate.value = v },
      setStatus: (v) => { status.value = v },
      setAssignedOwner: (v) => { 
        assignedOwner.value = v
        props.onAssignedOwnerUpdate?.(v)
      },
      assignItems: computed(() => props.assignItems || []),
      onAssignedOwnerUpdate: props.onAssignedOwnerUpdate,
    }

    expose({ submitForm, deleteAsset })

    return state
  },
  render(Ruki) {
    function field(label, control, required = false) {
      return buildGrid({
        columns: 1, rows: 2, display: false, rowGap: 2,
        child: {
          1: buildText(required ? `${label} *` : label, { size: 'xs', weight: 'bold', color: 'gray700', style: { marginLeft: '10px' } }),
          2: control,
        },
      })
    }

    return buildGrid({
      columns: 3, rows: 4, display: true, padding: '16px', colGap: 16, rowGap: 16,
      borderRadius: '12px', backgroundColor: '#ffffff', style: { height: 'fit-content' },
      span: { 10: { colSpan: 3 }, 11: { colSpan: 3 } },
      child: {
        1: field('Asset No. *', buildInput({ placeholder: 'e.g. LAP-001', size: 'sm', full: true, value: Ruki.assetNo, onUpdate: Ruki.setAssetNo, disabled: Ruki.mode === 'edit', style: { border: 'none', backgroundColor: '#f1f5f9', paddingLeft: '14px' } })),
        2: field('Type *', buildDropdown({ placeholder: 'Select type', items: [{ text: 'Laptop', value: 'laptop' }, { text: 'Desktop', value: 'desktop' }, { text: 'Monitor', value: 'monitor' }, { text: 'Tablet', value: 'tablet' }], value: Ruki.type, onUpdate: Ruki.setType, width: '100%', height: '34px', style: { border: 'none', backgroundColor: '#f1f5f9' } })),
        3: field('Serial', buildInput({ placeholder: 'Serial number', size: 'sm', full: true, value: Ruki.serial, onUpdate: Ruki.setSerial, style: { border: 'none', backgroundColor: '#f1f5f9', paddingLeft: '14px' } })),
        4: field('Use Time (years)', buildInput({ placeholder: 'e.g. 4', size: 'sm', full: true, value: Ruki.useTimeYears, onUpdate: Ruki.setUseTimeYears, style: { border: 'none', backgroundColor: '#f1f5f9', paddingLeft: '14px' } })),
        5: field('Purchase Date', buildDateBoxContainer({ placeHolder: 'mm/dd/yyyy', value: Ruki.purchaseDate, width: '100%', height: '34px', color: '#6b7280', colorCon: '#f1f5f9', padding: '0 16px 0 14px', borderRadius: '10px', border: 'none', insert: true, textStyle: { fontSize: '13px' }, onUpdate: Ruki.setPurchaseDate })),
        6: field('Expired Date', buildDateBoxContainer({ placeHolder: 'mm/dd/yyyy', value: Ruki.expiredDate, width: '100%', height: '34px', color: '#6b7280', colorCon: '#f1f5f9', padding: '0 16px 0 14px', borderRadius: '10px', border: 'none', insert: true, textStyle: { fontSize: '13px' }, onUpdate: Ruki.setExpiredDate })),
        7: field('Status', buildDropdown({ placeholder: 'Select status', items: [{ text: 'Available', value: 'available' }, { text: 'Assigned', value: 'assigned' }, { text: 'Maintenance', value: 'maintenance' }], value: Ruki.status, onUpdate: Ruki.setStatus, width: '100%', height: '34px', style: { border: 'none', backgroundColor: '#f1f5f9' } })),
        8: field('Assigned User', buildDropdown({
          placeholder: 'Unassigned',
          items: Ruki.assignItems?.value || Ruki.assignItems || [],
          value: Ruki.assignedOwner,
          onUpdate: Ruki.setAssignedOwner,
          width: '100%',
          height: '34px',
          style: { border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9' },
        })),
        10: Ruki.formError ? buildText(Ruki.formError, { size: 'xs', color: '#dc2626', weight: 'bold' }) : null,
        11: Ruki.canManageAssets
          ? buildGrid({
              columns: 3, rows: 1, colGap: 10, display: false,
              style: { marginTop: '10px' },
              child: {
                1: buildButton('Delete', { color: 'error', variant: 'outline', size: 'sm', onPressed: Ruki.onDeleteClick, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                2: buildButton('Cancel', { variant: 'outline', color: 'neutral', size: 'sm', onPressed: Ruki.$props.onCancel, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                3: buildButton('Update', { color: 'primary', size: 'sm', onPressed: Ruki.submitForm, style: { width: '100%', height: '38px', fontWeight: '700' } }),
              }
            })
          : null,
      },
    })
  }
})
