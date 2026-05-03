# Comprehensive Admin System - Implementation Guide

## Overview
A complete content management system has been implemented that allows editing of ALL text and images across the entire website through the `/admin` page. All changes are saved to Firebase Realtime Database and displayed in real-time.

## Features Implemented

### 1. **Content Store (Firebase-Backed)**
- **Location**: `src/store/contentStore.js`
- **Features**:
  - Multi-language support (English, German, Bosnian)
  - Real-time Firebase sync
  - Default content fallback
  - Automatic migration from localStorage to Firebase
  - Image/video URL support

### 2. **Admin Dashboard**
- **Location**: `src/components/admin/AdminDashboard.jsx`
- **Features**:
  - Two-panel layout (Editor + Live Preview)
  - Language switcher (EN, DE, BS)
  - Tab navigation (Content Editor / Product Manager)
  - Click-to-edit from live preview (planned)
  - Real-time preview updates

### 3. **Content Editor**
- **Location**: `src/components/admin/ContentEditor.jsx`
- **Features**:
  - Search functionality
  - Section filtering (Hero, Features, Testimonials, etc.)
  - Pending changes tracking
  - Batch save to Firebase
  - Image/Video URL fields with preview
  - Field highlighting when selected
  - Auto-scroll to selected field
  - Discard changes option
  - Reset to defaults option

### 4. **Live Preview**
- **Location**: `src/components/admin/LivePreview.jsx`
- **Features**:
  - Iframe-based preview
  - Page selector (Home, Shop, About, Contact)
  - Message passing for click-to-edit
  - Real-time content updates

### 5. **Editable Content Wrapper**
- **Location**: `src/components/admin/EditableContent.jsx`
- **Features**:
  - Click-to-edit functionality
  - Hover highlighting
  - Field identification tooltip
  - Admin-mode detection

## Content Structure

### All Editable Content Keys

#### Hero Section
- `hero_subtitle` - Badge text
- `hero_title` - Main heading
- `hero_description` - Description text
- `hero_button_primary` - Primary CTA button
- `hero_button_secondary` - Secondary CTA button
- `hero_video` - Background video URL
- `logo_image` - Logo image URL

#### Stats
- `stats_designs` - Designs created label
- `stats_satisfaction` - Satisfaction label
- `stats_delivery` - Delivery label

#### How It Works Section
- `process_badge` - Section badge
- `process_title` - Section title
- `process_description` - Section description
- `step1_title` - Step 1 title
- `step1_desc` - Step 1 description
- `step2_title` - Step 2 title
- `step2_desc` - Step 2 description
- `step3_title` - Step 3 title
- `step3_desc` - Step 3 description

#### Features Section
- `features_badge` - Section badge
- `features_title` - Section title
- `features_subtitle` - Section subtitle
- `features_description` - Section description
- `feature1_title` through `feature4_title` - Feature titles
- `feature1_desc` through `feature4_desc` - Feature descriptions

#### Categories Section
- `categories_title` - Section title
- `categories_badge` - Section badge
- `categories_view_all` - View all button text
- `category_men_polos`, `category_women_polos`, etc. - Category labels

#### Featured Section
- `featured_title` - Section title
- `featured_image` - Featured image URL

#### Testimonials Section
- `testimonials_badge` - Section badge
- `testimonials_title` - Section title
- `testimonials_subtitle` - Section subtitle
- `testimonials_description` - Section description
- `testimonial1_name`, `testimonial1_role`, `testimonial1_text` - Testimonial 1
- `testimonial2_name`, `testimonial2_role`, `testimonial2_text` - Testimonial 2
- `testimonial3_name`, `testimonial3_role`, `testimonial3_text` - Testimonial 3
- `trust_customers`, `trust_rating`, `trust_delivery` - Trust indicators

#### Call to Action Section
- `cta_badge` - Section badge
- `cta_title` - Main heading
- `cta_description` - Description
- `cta_button` - CTA button text
- `cta_feature1_title`, `cta_feature1_desc` - Feature 1
- `cta_feature2_title`, `cta_feature2_desc` - Feature 2
- `cta_feature3_title`, `cta_feature3_desc` - Feature 3

#### About Page
- `about_badge` - Page badge
- `about_title` - Page title
- `about_subtitle` - Page subtitle
- `mission_badge`, `mission_title`, `mission_desc1`, `mission_desc2` - Mission section
- `values_badge`, `values_title` - Values section
- `about_cta_title`, `about_cta_desc` - CTA section

#### Contact Page
- `contact_badge` - Page badge
- `contact_title` - Page title
- `contact_subtitle` - Page subtitle
- `contact_form_title` - Form title
- `contact_info_title`, `contact_info_desc` - Info section
- `contact_email_label`, `contact_email` - Email
- `contact_phone_label`, `contact_phone_1`, `contact_phone_2`, `contact_phone_3` - Phone numbers
- `contact_mobile_label` - Mobile label
- `contact_website_label`, `contact_website` - Website
- `contact_hours_label`, `contact_hours` - Business hours
- `faq_badge`, `faq_title` - FAQ section

#### Navigation
- `nav_home`, `nav_shop`, `nav_about` - Navigation labels

#### Shop Page
- `shop_title` - Page title
- `shop_description` - Page description
- `shop_filter_category`, `shop_filter_size` - Filter labels
- `shop_no_products` - No products message

#### Product Page
- `product_color`, `product_size` - Product labels
- `product_add_to_cart` - Add to cart button
- `product_details`, `product_customize` - Action buttons

#### Editor
- `editor_zones`, `editor_save`, `editor_package`, `editor_design_png` - Editor buttons
- `editor_tools`, `editor_add_text`, `editor_upload_image` - Tool labels
- `editor_shapes`, `editor_templates`, `editor_delete` - More tools
- `editor_controls`, `editor_scale`, `editor_position_x`, `editor_position_y` - Controls
- `editor_rotation`, `editor_color` - More controls
- `editor_front`, `editor_back`, `editor_sleeves` - View labels

## How to Use

### Accessing the Admin Panel
1. Navigate to `/admin`
2. Login with credentials (if authentication is enabled)
3. You'll see the admin dashboard with two panels

### Editing Content
1. **Using the Content Editor (Left Panel)**:
   - Use the search bar to find specific content
   - Filter by section using the category buttons
   - Edit text in the textarea fields
   - For images/videos, paste the URL in the input field
   - Changes are tracked with an orange dot (●)
   - Click "Save Changes" to save all pending changes to Firebase

2. **Using Live Preview (Right Panel)**:
   - Select the page you want to preview: **Home**, **Shop**, **About**, or **Contact**
   - The preview updates in real-time after saving
   - All pages are now available for preview and editing

3. **Language Management**:
   - Use the language selector in the top bar
   - Switch between English, German, and Bosnian
   - Edit content for each language separately
   - All languages are saved independently

### Editing About Page Content
1. Click the **"About"** button in the Live Preview section
2. In the Content Editor, filter by **"About"** section
3. Edit fields like:
   - `about_badge` - "Our Story"
   - `about_title` - "About Us"
   - `about_subtitle` - Page subtitle
   - `mission_badge`, `mission_title`, `mission_desc1`, `mission_desc2`
   - `values_badge`, `values_title`
   - `about_cta_title`, `about_cta_desc`
4. Click "Save Changes"
5. See changes in the Live Preview

### Editing Contact Page Content
1. Click the **"Contact"** button in the Live Preview section
2. In the Content Editor, filter by **"Contact"** section
3. Edit fields like:
   - `contact_badge` - "Get In Touch"
   - `contact_title` - "Contact Us"
   - `contact_subtitle` - Page subtitle
   - `contact_form_title` - Form heading
   - `contact_info_title`, `contact_info_desc`
   - `contact_email`, `contact_phone_1`, `contact_phone_2`, `contact_phone_3`
   - `contact_website`, `contact_hours`
   - `faq_badge`, `faq_title`
4. Click "Save Changes"
5. See changes in the Live Preview

### Managing Changes
- **Save Changes**: Saves all pending edits to Firebase
- **Discard Changes**: Reverts all unsaved edits
- **Reset All to Defaults**: Restores all content to original defaults (cannot be undone)

### Image/Video Fields
- Fields ending with `_image`, `_video`, or `_icon` are treated as media fields
- Enter the full URL or relative path (e.g., `/images/logo.png`)
- A preview will appear below the input if the URL is valid
- Supports images (JPG, PNG, GIF) and videos (MP4, WEBM)

## Firebase Structure

```
firebase-database/
├── siteContent/
│   ├── en/
│   │   ├── hero_title: "..."
│   │   ├── hero_description: "..."
│   │   └── ...
│   ├── de/
│   │   └── ...
│   └── bs/
│       └── ...
├── siteLanguage: "en"
└── printDecals/
    └── ...
```

## Integration with Pages

All pages use the `useContentStore` hook to access content:

```javascript
import { useContentStore } from "../store/contentStore.js";

function MyPage() {
  const getText = useContentStore((s) => s.getText);
  
  return (
    <h1>{getText("hero_title")}</h1>
  );
}
```

## Next Steps (Optional Enhancements)

1. **Click-to-Edit in Live Preview**:
   - Wrap all content in pages with `<EditableContent>` component
   - Enable message passing from iframe to parent
   - Auto-scroll to field when clicked in preview

2. **Image Upload**:
   - Add Firebase Storage integration
   - File upload UI in ContentEditor
   - Automatic URL generation after upload

3. **Content History**:
   - Track changes over time
   - Ability to revert to previous versions
   - Change log with timestamps

4. **Bulk Operations**:
   - Export all content to JSON
   - Import content from JSON
   - Duplicate content across languages

5. **Advanced Permissions**:
   - Role-based access control
   - Restrict editing of certain sections
   - Approval workflow for changes

## Troubleshooting

### Changes not appearing in preview
- Make sure you clicked "Save Changes"
- Refresh the preview iframe manually
- Check browser console for errors

### Image not displaying
- Verify the URL is correct and accessible
- Check if the image path is relative or absolute
- Ensure the image file exists in the public folder

### Firebase errors
- Check Firebase configuration in `src/firebase/config.js`
- Verify Firebase Realtime Database rules allow read/write
- Check browser console for specific error messages

## Security Notes

- The admin panel should be protected with authentication
- Firebase rules should restrict write access to authenticated users only
- Consider adding CSRF protection for production
- Validate all user input before saving to Firebase
