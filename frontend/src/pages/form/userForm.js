import { ref } from 'vue'
import {
  buildButton,
  buildContentGrid,
  buildDropdown,
  buildGrid,
  buildHeader,
  buildIcon,
  buildIconContainer,
  buildInput,
  buildTapOption,
  buildText,
} from '../../ui/index.js'

export function UserFormPage(user) {
  return {
    name: 'UserFormPage',
    setup() {
      const fullName = ref('')
      const email = ref('')
      const employeeId = ref('')
      const department = ref(null)
      const role = ref(null)
      const position = ref('')
      const company = ref('BuilderUI')
      const costCenter = ref('')
      const assets = ref('0')
      const status = ref('active')
      const isSaved = ref(false)
      const isSubmitting = ref(false)
      const errorMessage = ref('')

      const roleItems = [
        { text: 'Admin', value: 'admin' },
        { text: 'Manager', value: 'manager' },
        { text: 'Staff', value: 'staff' },
      ]

      const departmentItems = [
        { text: 'IT Operations', value: 'it-ops' },
        { text: 'Finance', value: 'finance' },
        { text: 'Human Resource', value: 'hr' },
        { text: 'Procurement', value: 'procurement' },
      ]

      function goBack() {
        if (typeof globalThis.__appNavigate === 'function') {
          globalThis.__appNavigate('/users')
        }
      }

      async function onSave() {
        if (isSubmitting.value) return
        errorMessage.value = ''

        if (!fullName.value || !email.value || !role.value || !department.value) {
          errorMessage.value = 'Please fill Full Name, Email, Department, and Role.'
          return
        }

        isSubmitting.value = true
        try {
          const payload = {
            name: fullName.value,
            email: email.value,
            employeeId: employeeId.value,
            department: department.value,
            role: role.value,
            position: position.value,
            company: company.value,
            costCenter: costCenter.value,
            assets: Number(assets.value || 0),
            status: status.value === 'active' ? 'Active' : 'Inactive',
            issues: 0,
          }

          const res = await fetch('http://127.0.0.1:5050/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

          if (!res.ok) throw new Error(`Failed to create user: ${res.status}`)

          isSaved.value = true
          setTimeout(() => {
            goBack()
          }, 1100)
        } catch (err) {
          errorMessage.value = 'Failed to create user. Please try again.'
        } finally {
          isSubmitting.value = false
        }
      }

      function onCancel() {
        goBack()
      }

      return {
        fullName,
        email,
        employeeId,
        department,
        role,
        position,
        company,
        costCenter,
        assets,
        status,
        isSaved,
        isSubmitting,
        errorMessage,
        roleItems,
        departmentItems,
        onSave,
        onCancel,
      }
    },

    render(Ruki) {
      if (Ruki.isSaved) {
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
                3: buildText('User created successfully.', { size: 'md', color: '#4b5563' }),
              }
            })
          }
        })
      }

      return buildContentGrid({
        columns: 6,
        rows: 3,
        padding: '24px',
        cellPadding: 0,
        colGap: 12,
        rowGap: 12,
        display: false,
        fillViewport: true,
        span: {
          1: { colSpan: 6 },
          7: { colSpan: 6 },
          13: { colSpan: 6 },
        },
        child: {
          1: buildHeader({
            title: 'Create New User',
            subtitle: `Add a new team member for ${user?.name || 'your organization'}.`,
            leftNode: buildIconContainer({
              icon: 'arrow-back',
              colorIcon: '#6366f1',
              colorCon: '#e0e7ff',
              size: '40',
              radius: '12px',
              containerStyle: 'square',
              hover: true,
              onPressed: Ruki.onCancel,
            }),
            backgroundColor: 'transparent',
            divider: false,
            padding: '30px 24px 22px',
            actionText: 'Save User',
            actionIcon: buildIcon('plus', { size: 14, color: '#ffffff' }),
            onAction: Ruki.onSave,
            style: {
              margin: '-24px 0 0 -24px',
              width: 'calc(100% + 48px)',
            },
          }),

          7: buildGrid({
            columns: 6,
            rows: 5,
            display: true,
            padding: '18px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            radius: 12,
            colGap: 12,
            rowGap: 10,
            span: {
              1: { colSpan: 3 },
              4: { colSpan: 3 },
              7: { colSpan: 2 },
              9: { colSpan: 2 },
              11: { colSpan: 2 },
              13: { colSpan: 3 },
              16: { colSpan: 3 },
              19: { colSpan: 6 },
              25: { colSpan: 3 },
              28: { colSpan: 3 },
              31: { colSpan: 6 },
            },
            child: {
              1: buildInput({
                label: 'FULL NAME',
                placeholder: 'Enter full name',
                value: Ruki.fullName,
                onUpdate: (v) => { Ruki.fullName = v },
                full: true,
                style: { paddingLeft: '14px' },
              }),
              4: buildInput({
                label: 'EMAIL',
                placeholder: 'name@company.com',
                value: Ruki.email,
                onUpdate: (v) => { Ruki.email = v },
                full: true,
                style: { paddingLeft: '14px' },
              }),
              7: buildInput({
                label: 'EMPLOYEE ID',
                placeholder: 'EMP-0001',
                value: Ruki.employeeId,
                onUpdate: (v) => { Ruki.employeeId = v },
                full: true,
                style: { paddingLeft: '14px' },
              }),
              9: buildDropdown({
                label: 'DEPARTMENT',
                placeholder: 'Select department',
                items: Ruki.departmentItems,
                value: Ruki.department,
                onUpdate: (v) => { Ruki.department = v },
                width: '100%',
                height: '40px',
                style: { marginTop: '22px' },
              }),
              11: buildDropdown({
                label: 'ROLE',
                placeholder: 'Select role',
                items: Ruki.roleItems,
                value: Ruki.role,
                onUpdate: (v) => { Ruki.role = v },
                width: '100%',
                height: '40px',
                style: { marginTop: '22px' },
              }),
              13: buildInput({
                label: 'POSITION',
                placeholder: 'e.g., IT Administrator',
                value: Ruki.position,
                onUpdate: (v) => { Ruki.position = v },
                full: true,
                style: { paddingLeft: '14px' },
              }),
              16: buildInput({
                label: 'COMPANY',
                placeholder: 'Organization name',
                value: Ruki.company,
                onUpdate: (v) => { Ruki.company = v },
                full: true,
                style: { paddingLeft: '14px' },
              }),
              19: buildInput({
                label: 'COST CENTER',
                placeholder: 'e.g., IT-OPS-01',
                value: Ruki.costCenter,
                onUpdate: (v) => { Ruki.costCenter = v },
                full: true,
                style: { paddingLeft: '14px' },
              }),
              25: buildInput({
                label: 'ASSETS',
                placeholder: '0',
                type: 'number',
                value: Ruki.assets,
                onUpdate: (v) => { Ruki.assets = v },
                full: true,
                style: { paddingLeft: '14px' },
              }),
              28: buildGrid({
                columns: 1,
                rows: 2,
                display: false,
                rowGap: 6,
                child: {
                  1: buildText('ACCOUNT STATUS', { size: 'xs', weight: 'bold', color: 'gray700' }),
                  2: buildTapOption({
                    items: [
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ],
                    value: Ruki.status,
                    onChange: (val) => { Ruki.status = val },
                    height: '40px',
                    bg: '#f8fafc',
                    selectedBg: '#ffffff',
                    selectedColor: '#1d4ed8',
                    color: '#64748b',
                    style: { border: '1px solid #dbeafe', padding: '0', height: '40px' },
                  }),
                },
              })
            },
          }),

          13: buildText(Ruki.errorMessage || 'Fill required fields then click Save User.', {
            size: 'xs',
            color: Ruki.errorMessage ? 'error' : 'gray500',
            style: { marginLeft: '6px' },
          }),
        },
      })
    },
  }
}
