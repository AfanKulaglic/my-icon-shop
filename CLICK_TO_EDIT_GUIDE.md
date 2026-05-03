# Click-to-Edit Feature - WordPress/Shopify Style ✨

## Overview
The admin panel now features a **click-to-edit** system similar to WordPress and Shopify! You can hover over content in the live preview and click to edit it directly.

## How It Works

### Visual Feedback
```
┌─────────────────────────────────────────────────────────────┐
│  Live Preview                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────┐                │  │
│  │  │ ✏️ Click to edit: hero_title   │ ← Tooltip      │  │
│  │  └─────────────────────────────────┘                │  │
│  │  ╔═══════════════════════════════╗                  │  │
│  │  ║ Wear what you design.         ║ ← Dashed border │  │
│  │  ╚═══════════════════════════════╝    on hover     │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### User Experience

1. **Hover** over any editable content in the live preview
   - A **dashed blue border** appears around the content
   - A **tooltip** shows above with "✏️ Click to edit: field_name"
   - Cursor changes to pointer

2. **Click** on the content
   - The Content Editor on the left automatically scrolls to that field
   - The field is **highlighted with a blue background**
   - You can immediately start editing

3. **Edit** the content
   - Make your changes in the text area
   - See the orange dot (●) indicating unsaved changes
   - Click "Save Changes" to save

4. **Preview** updates
   - After saving, the live preview shows your changes
   - Hover and click again to edit more content

## Editable Content

### Home Page
All major content is now click-to-edit:

#### Hero Section
- ✅ Hero subtitle badge
- ✅ Hero title
- ✅ Hero description
- ✅ Hero buttons (text)

#### How It Works
- ✅ Section badge
- ✅ Section title
- ✅ Section description
- ✅ Step 1 title & description
- ✅ Step 2 title & description
- ✅ Step 3 title & description

#### Features
- ✅ Section badge
- ✅ Section title
- ✅ Section subtitle
- ✅ Section description
- ✅ Feature 1-4 titles
- ✅ Feature 1-4 descriptions

#### Testimonials
- ✅ Testimonial 1-3 text
- ✅ Testimonial 1-3 names
- ✅ Testimonial 1-3 roles

### About Page
- ✅ About badge
- ✅ About title
- ✅ About subtitle
- ✅ Mission badge
- ✅ Mission title
- ✅ Mission descriptions (2 paragraphs)

### Contact Page
- ✅ Contact badge
- ✅ Contact title
- ✅ Contact subtitle
- ✅ Form title
- ✅ Contact info title
- ✅ Contact info description

## Technical Implementation

### EditableContent Component
Located at: `src/components/admin/EditableContent.jsx`

**Features:**
- Detects if running in iframe (live preview)
- Shows hover effects with dashed border
- Displays tooltip with field name
- Sends message to parent window on click
- Supports custom HTML elements via `as` prop

**Usage:**
```jsx
<EditableContent id="hero_title" as="h1">
  <h1>{getText("hero_title")}</h1>
</EditableContent>
```

### Message Passing
When you click on editable content:

1. **Iframe (Live Preview)** sends message:
```javascript
window.parent.postMessage({
  type: 'EDIT_CONTENT',
  key: 'hero_title'
}, '*');
```

2. **Parent (Admin Dashboard)** receives message:
```javascript
// Scrolls to field in Content Editor
// Highlights the field
// User can immediately edit
```

### Auto-Scroll & Highlight
When a field is selected:
- Content Editor scrolls to show the field
- Field gets blue background highlight
- Highlight pulses for 2 seconds
- Field is ready for editing

## Visual Design

### Hover State
```css
- Outline: 2px dashed #6366F1 (accent blue)
- Outline Offset: 4px
- Cursor: pointer
- Transition: smooth 0.2s
```

### Tooltip
```css
- Background: Linear gradient (accent colors)
- Color: White
- Padding: 4px 12px
- Border Radius: 6px
- Font Size: 11px
- Font Weight: 600
- Shadow: 0 4px 12px rgba(99, 102, 241, 0.4)
- Icon: ✏️ emoji
```

### Field Highlight (in Editor)
```css
- Background: rgba(99, 102, 241, 0.1)
- Border: 2px solid accent
- Animation: Pulse for 2 seconds
- Padding: 12px
- Border Radius: 8px
```

## Step-by-Step Example

### Example 1: Edit Hero Title
```
1. Go to /admin
2. Click [Home] in Live Preview
3. Hover over "Wear what you design." in the preview
   → Dashed border appears
   → Tooltip shows "✏️ Click to edit: hero_title"
4. Click on the text
   → Content Editor scrolls to hero_title field
   → Field is highlighted in blue
5. Edit the text: "Create what you wear."
6. Click "Save Changes"
7. See the change in Live Preview
```

### Example 2: Edit Testimonial
```
1. Go to /admin
2. Click [Home] in Live Preview
3. Scroll down to testimonials section
4. Hover over a testimonial text
   → Dashed border appears
   → Tooltip shows "✏️ Click to edit: testimonial1_text"
5. Click on the testimonial
   → Content Editor scrolls to testimonial1_text
   → Field is highlighted
6. Edit the testimonial
7. Click "Save Changes"
8. See updated testimonial in preview
```

### Example 3: Edit About Page Mission
```
1. Go to /admin
2. Click [About] in Live Preview
3. Hover over mission description
   → Dashed border appears
   → Tooltip shows "✏️ Click to edit: mission_desc1"
4. Click on the text
   → Content Editor scrolls to mission_desc1
   → Field is highlighted
5. Edit the mission statement
6. Click "Save Changes"
7. See updated mission in About page preview
```

## Browser Compatibility

✅ **Supported:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

✅ **Features:**
- Iframe message passing
- CSS outline with offset
- Smooth scrolling
- CSS animations

## Troubleshooting

### Content not clickable?
- Make sure you're viewing the page in the Live Preview (iframe)
- Check that the content is wrapped with `<EditableContent>`
- Verify the `id` prop matches a field in the content store

### Click doesn't scroll to field?
- Check browser console for errors
- Verify the field exists in Content Editor
- Make sure the `data-field-key` attribute is set correctly

### Hover effect not showing?
- Ensure you're in the Live Preview iframe
- Check that CSS is loaded correctly
- Verify the component is properly wrapped

### Tooltip not appearing?
- Check z-index conflicts
- Verify tooltip positioning
- Ensure pointer-events are not blocked

## Performance

- **Lightweight**: Minimal overhead per editable element
- **Efficient**: Only active in iframe (live preview)
- **Fast**: Instant hover feedback
- **Smooth**: Hardware-accelerated animations

## Future Enhancements

Possible improvements:
- [ ] Inline editing (edit directly in preview)
- [ ] Drag-and-drop to reorder sections
- [ ] Visual indicators for image fields
- [ ] Keyboard shortcuts (Cmd+Click for quick edit)
- [ ] Multi-select for batch editing
- [ ] Undo/redo for preview changes

## Summary

🎉 **Click-to-edit is now live!**

You can now:
- **Hover** over content to see what's editable
- **Click** to jump to the editor
- **Edit** with instant field highlighting
- **Save** and see changes in real-time

Just like WordPress and Shopify, but for your custom apparel site! ✨
