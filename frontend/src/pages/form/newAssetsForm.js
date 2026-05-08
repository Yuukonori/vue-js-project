import { ref, h, computed, onMounted } from 'vue'
import {
  buildButton,
  buildContentGrid,
  buildGrid,
  buildHeader,
  buildIcon,
  buildIconContainer,
  buildText,
} from '../../ui/index.js'
import { AssetForm } from './AssetForm.js'

export function NewAssetsForm(user) {
  return {
    name: 'NewAssetsForm',
    setup() {
      const isSuccess = ref(false)
      const formRef = ref(null)
      const users = ref([])
      const selectedOwnerId = ref(null)

      async function fetchUsers() {
        try {
          let res = await fetch('http://127.0.0.1:5050/api/users')
          if (!res.ok) {
            res = await fetch('/api/users')
          }
          if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
          const list = await res.json()
          users.value = Array.isArray(list) ? list : []
        } catch (err) {
          console.error('Failed to fetch users for asset form:', err)
          users.value = []
        }
      }

      const assignItems = computed(() => ([
        { text: 'Unassigned', value: null },
        ...users.value.map(u => ({ text: u.name, value: u.id })),
      ]))

      function goBack() {
        if (typeof globalThis.__appNavigate === 'function') {
          globalThis.__appNavigate('/assets')
        }
      }

      function handleSuccess() {
        isSuccess.value = true
        setTimeout(goBack, 2000)
      }

      const triggerSubmit = () => formRef.value?.submitForm()

      onMounted(async () => {
        await fetchUsers()
      })

      return { isSuccess, goBack, handleSuccess, formRef, triggerSubmit, assignItems, selectedOwnerId }
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
                3: buildText('Asset successfully registered to inventory.', { size: 'md', color: '#4b5563' }),
              }
            })
          }
        })
      }

      return buildContentGrid({
        columns: 6, rows: 2, padding: '24px', cellPadding: 0, colGap: 12, rowGap: 12, display: false, fillViewport: true,
        span: { 1: { colSpan: 6, rowSpan: 1 }, 7: { colSpan: 6 } },
        child: {
          1: buildHeader({
            title: 'Register New Asset',
            subtitle: `Create new asset profile for ${user?.name || 'your team'}.`,
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
            actionText: 'Add',
            actionIcon: buildIcon('plus', { size: '18', color: 'white' }),
            onAction: Ruki.triggerSubmit,
            actionStyle: { width: '120px', height: '40px', borderRadius: '12px', gap: '8px' },
            backgroundColor: 'white',
            divider: false,
            padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          7: h(AssetForm, {
            ref: 'formRef',
            assignItems: Ruki.assignItems.value || Ruki.assignItems,
            assignedOwner: Ruki.selectedOwnerId,
            onAssignedOwnerUpdate: (v) => { Ruki.selectedOwnerId = v },
            onSuccess: Ruki.handleSuccess,
            onCancel: Ruki.goBack
          }),
        },
      })
    },
  }
}
