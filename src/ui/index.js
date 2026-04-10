/**
 * Vue Builder UI — Public API
 *
 * Import everything you need:
 *   import { webFrame, buildText, buildButton, buildIcon, ... } from './ui'
 *
 * Or import everything:
 *   import * as UI from './ui'
 */

// ── Layout ──────────────────────────────────────────────────────────────────
export { webFrame }                                   from './builders/frame.js'
export { buildGrid, buildContentGrid, GridSpan }      from './builders/grid.js'

// ── Typography ──────────────────────────────────────────────────────────────
export { buildText }                                  from './builders/text.js'
export { buildTextBadge }                             from './builders/textBadge.js'
export { buildHeader }                                from './builders/header.js'

// ── Buttons ─────────────────────────────────────────────────────────────────
export { buildButton }                                from './builders/button.js'

// ── Icons ────────────────────────────────────────────────────────────────────
export { buildIcon }                                  from './builders/icon.js'
export { buildIconContainer }                         from './builders/iconContainer.js'
export { buildIconTextContainer }                     from './builders/iconTextContainer.js'
export { buildIconText }                              from './builders/IconText.js'

// ── Navigation ───────────────────────────────────────────────────────────────
export { buildMenu, buildNavbar, buildSidebar }       from './builders/menu.js'
export { buildTabs }                                  from './builders/tabs.js'

// ── Form Inputs ──────────────────────────────────────────────────────────────
export { buildInput }                                 from './builders/input.js'
export { buildTextbox }                               from './builders/textbox.js'
export { buildDateBoxContainer }                      from './builders/dateBoxContainer.js'
export { buildDropdown }                              from './builders/dropdown.js'
export { buildPopup }                                 from './builders/popup.js'
export { buildSearch }                                from './builders/search.js'
export { buildCheckbox }                              from './builders/checkbox.js'

// ── Data Display ─────────────────────────────────────────────────────────────
export { buildTable }                                 from './builders/table.js'

// ── Charts ───────────────────────────────────────────────────────────────────
export { buildLineChart }                             from './builders/lineChart.js'
export { buildDonutChart }                            from './builders/donutChart.js'
export { buildPieChart }                              from './builders/pieChart.js'
export { buildProgressBar }                           from './builders/progressBar.js'
export { buildCircularProgress }                      from './builders/CircularProgress.js'

// ── Media ────────────────────────────────────────────────────────────────────
export { buildImage }                                 from './builders/image.js'
export { buildImageProfile }                          from './builders/imageProfile.js'

// ── Decorators ───────────────────────────────────────────────────────────────
export { buildDivider }                               from './builders/divider.js'
export { buildBadge, buildChip }                      from './builders/badge.js'
export { buildReceiveCard }                           from './builders/receiveCard.js'

// ── Cards ────────────────────────────────────────────────────────────────────
export { buildCard }                                  from './builders/card.js'

// ── Utilities ────────────────────────────────────────────────────────────────
export { formatCurrencyShort, formatCurrency, formatValueShort, capitalize, replaceUnderscoreToSpace, replaceUnderscoreToEmpty } from './utils.js'

// ── Design tokens (for custom styles) ────────────────────────────────────────
export { colors, themeColorDescriptions, spacing, fontSize, fontWeight, radius, shadow, token } from './ThemesColors.js'
