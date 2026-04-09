# CodingLab Sidebar Theme Guide

This project now uses a dark, rounded, sectioned sidebar style inspired by your reference image.

## Where To Edit

- Sidebar structure/theme usage: `src/App.vue`
- Sidebar renderer behavior/options: `src/ui/builders/menu.js` (`buildSidebar`)
- Page routing + labels/icons: `src/menu.js`

## What Was Changed

### 1) `buildSidebar` got new style options
In `src/ui/builders/menu.js`, `buildSidebar` now supports:

- `itemColor`: label color for inactive items
- `mutedColor`: icon + section label color
- `dividerColor`: separator/border color
- `activeBgColor`: active item background color
- `radius`: sidebar card border radius
- `outerPadding`: padding around the sidebar card
- `section` item support (e.g. `{ section: 'Main Menu' }`)

### 2) `App.vue` now uses sectioned menu groups
In `src/App.vue`, sidebar items are built as:

- `Main Menu`: Dashboard, Assets, Monitoring
- `General`: Repair History, Activity Logs
- `Account`: Support

This is done in `sidebarItems` computed with `section` and `divider` entries.

### 3) Visual theme is dark card + light active chip
Current sidebar options in `App.vue`:

```js
buildSidebar({
  width: '240px',
  pad: '14px',
  bg: '#0f1735',
  itemColor: '#d7deef',
  mutedColor: '#7f8cae',
  dividerColor: '#2a355d',
  activeColor: '#0f1735',
  activeBgColor: '#ffffff',
  radius: '14px',
  outerPadding: '4px',
  ...
})
```

## Quick Customization

- Wider/narrower sidebar: change `width`
- More/less inner spacing: change `pad`
- Darker/lighter theme: change `bg`, `itemColor`, `mutedColor`
- Active pill style: change `activeBgColor`, `activeColor`
- Rounder card: increase `radius`

## Notes

- If you want your old menu order back, edit only `sidebarItems` in `App.vue`.
- If you want this theme reusable app-wide, keep `buildSidebar` options as defaults in `src/ui/builders/menu.js`.

