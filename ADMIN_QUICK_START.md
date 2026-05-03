# Admin Panel - Quick Start Guide

## 🚀 Getting Started

### Access the Admin Panel
```
URL: http://localhost:5173/admin
```

## 📋 Admin Interface Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  🏠 my-icon.shop                    🇬🇧 EN  🇩🇪 DE  🇧🇦 BS  Logout │
├──────────────────────┬──────────────────────────────────────────┤
│  Content Editor  │  Product Manager                            │
├──────────────────────┼──────────────────────────────────────────┤
│                      │  Live Preview                            │
│  🔍 Search...        │  ┌────────────────────────────────────┐  │
│                      │  │  Home  │  Shop                     │  │
│  [All] [Hero] [Features] [Testimonials] ...                  │  │
│                      │  └────────────────────────────────────┘  │
│  ┌─────────────────┐│                                          │
│  │ Hero Title ●    ││  ┌────────────────────────────────────┐  │
│  │ [text area]     ││  │                                    │  │
│  └─────────────────┘││  │     LIVE PREVIEW OF YOUR SITE     │  │
│                      │  │                                    │  │
│  ┌─────────────────┐││  │  (Shows actual page with changes) │  │
│  │ Hero Image      ││  │                                    │  │
│  │ [URL input]     ││  │                                    │  │
│  │ [preview]       ││  │                                    │  │
│  └─────────────────┘││  └────────────────────────────────────┘  │
│                      │                                          │
│  [Save Changes (3)] │                                          │
│  [Discard Changes]  │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

## 🎯 Common Tasks

### 1. Edit Hero Section Text
```
1. Click "Hero" filter button
2. Find "Hero Title" field
3. Edit the text
4. See orange dot (●) appear
5. Click "Save Changes"
```

### 2. Change an Image
```
1. Search for "image" or "logo"
2. Find the image field (has "Image/Video URL" label)
3. Paste new URL: /images/new-logo.png
4. See preview appear below
5. Click "Save Changes"
```

### 3. Edit Testimonials
```
1. Click "Testimonials" filter
2. Edit testimonial1_name, testimonial1_role, testimonial1_text
3. Repeat for testimonial2 and testimonial3
4. Click "Save Changes"
```

### 4. Change Language Content
```
1. Click 🇩🇪 DE (or 🇧🇦 BS) at the top
2. Edit content in German/Bosnian
3. Click "Save Changes"
4. Switch back to 🇬🇧 EN if needed
```

### 5. Preview Changes
```
1. Make your edits
2. Click "Save Changes"
3. Look at the Live Preview panel on the right
4. Switch between Home/Shop pages to see changes
```

## 🔍 Finding Content

### Use Search
```
Type in search box:
- "hero" → finds all hero section content
- "button" → finds all button text
- "testimonial" → finds all testimonials
- "image" → finds all image URLs
```

### Use Filters
```
Click section buttons:
- [All] → Show everything
- [Hero] → Hero section only
- [Features] → Features section only
- [Testimonials] → Testimonials only
- [About] → About page content
- [Contact] → Contact page content
```

## 💾 Saving Changes

### Pending Changes
- Orange dot (●) = Field has unsaved changes
- Number in button = Total pending changes
- Example: "Save Changes (5)" = 5 fields changed

### Save Options
1. **Save Changes** → Saves all pending edits to Firebase
2. **Discard Changes** → Reverts all unsaved edits
3. **Reset All to Defaults** → Restores original content (⚠️ cannot undo!)

## 📝 Field Types

### Text Fields
```
┌─────────────────────────┐
│ Hero Title              │
│ ┌─────────────────────┐ │
│ │ Wear what you design│ │
│ └─────────────────────┘ │
│ Key: hero_title         │
└─────────────────────────┘
```

### Image/Video Fields
```
┌─────────────────────────────────┐
│ Hero Video (Image/Video URL)    │
│ ┌─────────────────────────────┐ │
│ │ /videos/promo.mp4           │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │   [Video Preview]           │ │
│ └─────────────────────────────┘ │
│ Key: hero_video                 │
└─────────────────────────────────┘
```

## 🌍 Languages

### Supported Languages
- 🇬🇧 **EN** (English) - Default
- 🇩🇪 **DE** (Deutsch/German)
- 🇧🇦 **BS** (Bosanski/Bosnian)

### How It Works
- Each language has its own content
- Switch language to edit that language's content
- Changes are saved per language
- Users see content based on selected language

## ⚡ Quick Tips

### 1. Use Search for Speed
Instead of scrolling, search for what you need:
- "title" → All titles
- "desc" → All descriptions
- "button" → All button text

### 2. Filter by Section
Working on one section? Use filters:
- Editing hero? Click [Hero]
- Editing features? Click [Features]
- Editing testimonials? Click [Testimonials]

### 3. Save Often
- Save after each major change
- Don't lose work by closing without saving
- Orange dots (●) remind you of unsaved changes

### 4. Preview Before Publishing
- Check Live Preview after saving
- Switch between pages to verify
- Test on different sections

### 5. Image URLs
For images, use:
- **Relative paths**: `/images/logo.png`
- **Absolute URLs**: `https://example.com/image.jpg`
- **Public folder**: Files in `/public/images/` can be accessed as `/images/filename.jpg`

## 🎨 Content Sections

### Home Page Sections
- **Hero** → Main banner with title, description, buttons
- **Stats** → Numbers (designs, satisfaction, delivery)
- **Process** → How It Works (3 steps)
- **Features** → 4 feature cards
- **Categories** → Product categories
- **Featured** → Featured products section
- **Testimonials** → Customer reviews (3)
- **Trust** → Trust indicators
- **CTA** → Call to action section

### Other Pages
- **About** → About page content
- **Contact** → Contact page content
- **Shop** → Shop page labels
- **Product** → Product page labels
- **Editor** → Editor tool labels
- **Nav** → Navigation labels

## 🔧 Troubleshooting

### Changes Not Showing?
1. Did you click "Save Changes"?
2. Refresh the Live Preview
3. Check browser console for errors

### Image Not Displaying?
1. Check the URL is correct
2. Make sure file exists in `/public/images/`
3. Try absolute URL: `https://...`

### Can't Find a Field?
1. Use the search box
2. Try different keywords
3. Check the section filters
4. Look in ADMIN_SYSTEM_GUIDE.md for complete list

## 📚 More Help

- **Complete Guide**: See `ADMIN_SYSTEM_GUIDE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **All Field Keys**: Listed in `ADMIN_SYSTEM_GUIDE.md`

## 🎉 You're Ready!

Start editing your content now:
1. Go to `/admin`
2. Search or filter to find content
3. Edit the text or paste image URLs
4. Click "Save Changes"
5. Check the Live Preview

**Everything on your site is now editable!** 🚀
