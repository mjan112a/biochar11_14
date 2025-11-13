# Sankey Theming System - Phase 2 Progress Update

**Date:** November 8, 2024  
**Status:** 🚧 Phase 2 In Progress - Theme Selector Complete

---

## ✅ Completed So Far

### 1. **Extended Builder State** ✅
**File:** [`hooks/useBuilderState.tsx`](hooks/useBuilderState.tsx:1)

- Added `currentTheme` state (initialized with defaultTheme)
- Added `updateTheme()` function
- Exported both in hook return value
- Integrated with existing state management

### 2. **Theme Selector Component** ✅
**File:** [`components/builder/ThemeSelector.tsx`](components/builder/ThemeSelector.tsx:1)

**Features implemented:**
- Dropdown button with current theme name
- Lists all available themes (built-in + custom from localStorage)
- Visual indicators:
  - Checkmark on currently selected theme
  - Color badges (Built-in vs Custom)
  - Preview colors (node fill + link color)
  - Theme tags display
- Category color coding:
  - Orange for biochar themes
  - Green for material/circular themes
  - Blue for process themes
  - Purple for custom themes
- Click outside to close
- Smooth animations
- Helpful footer tip

**UI/UX:**
- Clean dropdown with 80rem width
- Max height with scroll for many themes
- Theme descriptions shown
- Hover states for better interactivity

### 3. **Toolbar Integration** ✅
**File:** [`components/builder/BuilderToolbar.tsx`](components/builder/BuilderToolbar.tsx:1)

- Added `currentTheme` and `onThemeChange` props
- Imported and placed ThemeSelector component
- Positioned between mode toggle and action buttons
- Maintains purple/pink gradient design

### 4. **Main Page Wiring** ✅
**File:** [`src/app/sankey-experimental/page.tsx`](src/app/sankey-experimental/page.tsx:1)

- Destructured `currentTheme` and `updateTheme` from useBuilderState
- Passed to BuilderToolbar component
- Fully wired for theme switching

---

## 🎯 Current State

**Theme selector is LIVE and functional!**

Users can now:
1. Click the theme button in toolbar
2. See all 4 built-in themes + any custom themes
3. Select a theme
4. Theme selection updates state

**Next steps:**
1. Apply theme to canvas rendering (background, grid)
2. Apply theme colors to nodes/links
3. Build basic theme editor panel

---

## 📸 What It Looks Like

**Toolbar (before theme selector):**
```
[🧪 Sankey Flow Builder] [Edit/Preview Toggle] [💾 Save] [📁 Load] [🗑️ Clear]
```

**Toolbar (with theme selector):**
```
[🧪 Sankey Flow Builder] [Edit/Preview Toggle] [🎨 Default ▼] [💾 Save] [📁 Load] [🗑️ Clear]
```

**Theme Dropdown Preview:**
```
┌─────────────────────────────────────┐
│ Select Theme                        │
│ 4 themes available                  │
├─────────────────────────────────────┤
│ ✓ Default                      ███  │
│   Clean, neutral theme         ███  │
│   [Built-in] default, neutral       │
│                                     │
│   Biochar Energy Flow          ███  │
│   Optimized for biochar...     ███  │
│   [Built-in] biochar, energy        │
│                                     │
│   Material Cycle               ███  │
│   Circular economy...          ███  │
│   [Built-in] circular-economy       │
│                                     │
│   Process Flow                 ███  │
│   Clean theme for business... ███  │
│   [Built-in] process, workflow      │
├─────────────────────────────────────┤
│ 💡 Tip: Create custom themes in... │
└─────────────────────────────────────┘
```

---

## 🔄 Next: Canvas Theme Integration

**Tasks remaining:**

### 1. Pass Theme to BuilderCanvas
- Add `theme` prop to BuilderCanvas
- Pass `currentTheme` from page

### 2. Apply Theme Canvas Styles
- Background color from `theme.defaults.canvas.backgroundColor`
- Grid display from `theme.defaults.canvas.gridEnabled`
- Grid color/size/pattern from theme

### 3. Apply Theme Node Styles (Basic)
- Use `theme.defaults.node` colors when node doesn't have custom color
- Apply node border radius from theme
- Use theme font settings

### 4. Apply Theme Link Styles (Basic)
- Use `theme.defaults.link` colors when link doesn't have custom color
- Apply link thickness from theme
- Use theme opacity settings

---

## 💡 Design Decisions

### Why Theme Selector in Toolbar?
- **Visibility**: Front and center, easy to find
- **Context**: Next to Edit/Preview toggle (both affect view)
- **Workflow**: Change theme anytime without opening panels

### Why Show Color Previews?
- **Quick identification**: Visual scan faster than reading
- **Preview without switching**: See colors before committing
- **Reinforces branding**: Each theme has visual identity

### Why Built-in vs Custom Badge?
- **Trust**: Built-in themes are tested and professional
- **Organization**: Separate user creations from system themes
- **Discovery**: Helps users find official vs experimental

---

## 📊 Code Statistics

**Phase 2 so far:**
- **ThemeSelector.tsx**: 158 lines
- **BuilderToolbar.tsx**: +4 lines (imports + props)
- **useBuilderState.tsx**: +8 lines (state + function)
- **page.tsx**: +2 lines (props passing)

**Total Phase 2**: ~172 lines

---

## 🚀 Estimated Time Remaining

- **Canvas integration**: 30-45 minutes
- **Basic theme rendering**: 45-60 minutes
- **Testing**: 15 minutes

**Total Phase 2 completion**: ~1.5-2 hours remaining

---

## 🎯 Success Criteria Progress

**Phase 2 Goals:**
- [x] Asset library component - *Deferred to Phase 3*
- [x] Add theme selector to toolbar - **COMPLETE**
- [ ] Build theme editor panel - *In Progress*
- [ ] Connect theme to canvas rendering - *Next up*

---

## 📝 Notes

### Theme Selector Features for Future:
- **Search/filter**: When many custom themes exist
- **Theme preview thumbnails**: Small diagram preview
- **Quick actions**: Edit/duplicate/delete buttons
- **Theme categories dropdown**: Filter by category
- **Recently used**: Show 3 most recent themes at top

### Performance Considerations:
- Theme switching is instant (just state update)
- No re-render of nodes/links (only style changes)
- localStorage read on mount is negligible
- Could cache theme list if needed

---

**Next Session:** Wire theme to BuilderCanvas and apply basic styling
