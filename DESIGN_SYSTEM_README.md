# Detection to Direction - Design System Documentation

## Overview
This is a comprehensive design system rebuild for the Detection to Direction application - a parent-friendly screening tool for early detection of ASD, ADHD, and Dyslexia with therapist recommendations.

## 🎨 Design System Foundation

### Brand Tone
- **Calm**: Soothing colors and gentle transitions
- **Trustworthy**: Professional typography and clear hierarchy
- **Parent-friendly**: Simple language and intuitive interactions
- **Professional**: Clean design following WCAG 2.1 AA standards

### Color Palette

```css
Primary (Soft Indigo): #4F46E5
Secondary (Teal): #14B8A6
Accent (Lavender): #8B5CF6
Background: #F8FAFC
Surface: #FFFFFF
Text Primary: #0F172A
Text Muted: #475569
Success: #16A34A
Warning: #F59E0B
Danger: #DC2626
```

### Typography
- **Font Family**: Inter (with system fallbacks)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight
- **Scale**: 14px / 16px / 18px / 20px / 24px / 30px / 36px

### Spacing Scale
4px, 8px, 12px, 16px, 24px, 32px, 48px

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px

### Shadows
- Soft shadows for cards
- Focus rings for accessibility
- Elevation through layered shadows

## 📁 File Structure

```
Detection-to-Direction/
├── public/
│   ├── css/
│   │   ├── tokens.css          # Design system tokens (CSS variables)
│   │   ├── components.css      # Component library
│   │   ├── print.css           # Print styles for results
│   │   └── style.css           # Legacy styles (to be replaced)
│   ├── js/
│   │   ├── icons.js            # SVG icon library
│   │   ├── router.js           # Client-side routing
│   │   ├── state.js            # State management
│   │   ├── screening.js        # Screening logic
│   │   ├── therapist-finder.js # Therapist search
│   │   └── app.js              # Main application
│   ├── data/
│   │   ├── questions.json      # Screening questions
│   │   ├── therapists.json     # Therapist centers
│   │   └── mock-data.js        # Mock data generator
│   ├── i18n/
│   │   ├── en.json             # English translations
│   │   └── ms.json             # Bahasa Malaysia translations
│   ├── pages/
│   │   ├── index.html          # Landing page
│   │   ├── auth.html           # Login/Signup
│   │   ├── children.html       # Child management
│   │   ├── screening.html      # Screening questionnaire
│   │   ├── results.html        # Screening results
│   │   ├── therapists.html     # Therapist finder
│   │   ├── help.html           # FAQ and help
│   │   └── account.html        # User settings
│   └── assets/
│       └── icons/              # SVG icons as separate files
├── server.js                   # Express server
├── routes/                     # API routes
├── sql/                        # Database schemas
└── README.md                   # Main documentation
```

## 🎯 Component Library

### Buttons
- **Primary**: Main call-to-action (Soft Indigo)
- **Secondary**: Alternative actions (Teal)
- **Ghost**: Tertiary actions (Transparent with border)
- **Danger**: Destructive actions (Red)

**Sizes**: Small, Default, Large
**States**: Default, Hover, Active, Disabled, Loading

### Forms
- **Input**: Text, email, password, number
- **Textarea**: Multi-line text
- **Select**: Dropdown selection
- **Radio**: Single selection (used for Likert scale)
- **Checkbox**: Multiple selections
- **Password Toggle**: Show/hide password

**Features**:
- Focus states with blue ring
- Error validation with red border
- Helper text support
- Password strength meter
- Required field indicators

### Cards
- Surface elevation with subtle shadow
- Header, body, and footer sections
- Hover effects for interactive cards

### Navigation
- Sticky navbar with mobile toggle
- Breadcrumbs for page hierarchy
- Active link highlighting

### Alerts & Toasts
- **Alert**: Inline notifications (Success, Warning, Danger, Info)
- **Toast**: Temporary notifications (auto-dismiss)

### Modal & Drawer
- **Modal**: Centered overlay dialog
- **Drawer**: Slide-in panel from right

### Progress & Loading
- **Progress Bar**: Visual progress indicator
- **Skeleton Loader**: Content loading placeholder
- **Button Spinner**: Loading state for buttons

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Focus-visible styles for keyboard navigation
- ✅ ARIA labels and descriptions
- ✅ Skip to main content link
- ✅ Screen reader announcements
- ✅ Form error messaging
- ✅ Reduced motion support

### Keyboard Navigation
- Tab through interactive elements
- Enter/Space to activate
- Escape to close modals
- Arrow keys in radio groups

### Screen Reader Support
- Semantic HTML5 elements
- ARIA landmarks
- Live regions for dynamic content
- Descriptive labels

## 🌐 Internationalization (i18n)

### Supported Languages
- **EN**: English (default)
- **MS**: Bahasa Malaysia

### Implementation
- JSON-based translation files
- Language switcher in account settings
- Automatic language detection
- RTL support ready (for future)

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Stack navigation on mobile
- Full-width buttons for touch
- Larger tap targets (44x44px minimum)
- Collapsible sections

## 🎭 Component Usage Examples

### Button
```html
<button class="btn btn-primary">
  Start Screening
</button>

<button class="btn btn-ghost btn-sm">
  Cancel
</button>

<button class="btn btn-primary btn-loading" disabled>
  Processing...
</button>
```

### Form Group
```html
<div class="form-group">
  <label class="form-label form-label-required" for="email">
    Email Address
  </label>
  <input
    type="email"
    id="email"
    class="form-input"
    placeholder="Enter your email"
    required
    aria-describedby="email-helper"
  />
  <span id="email-helper" class="form-helper">
    We'll never share your email
  </span>
</div>
```

### Card
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Child Profile</h3>
    <p class="card-description">Manage your child's information</p>
  </div>
  <div class="card-body">
    <!-- Content here -->
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Save</button>
    <button class="btn btn-ghost">Cancel</button>
  </div>
</div>
```

### Radio Group (Likert Scale)
```html
<div class="radio-group-horizontal">
  <label class="radio-option">
    <input type="radio" name="q1" value="0" />
    Never
  </label>
  <label class="radio-option">
    <input type="radio" name="q1" value="1" />
    Rarely
  </label>
  <label class="radio-option selected">
    <input type="radio" name="q1" value="2" checked />
    Sometimes
  </label>
  <label class="radio-option">
    <input type="radio" name="q1" value="3" />
    Often
  </label>
  <label class="radio-option">
    <input type="radio" name="q1" value="4" />
    Very Often
  </label>
</div>
```

### Toast Notification (JavaScript)
```javascript
// Show success toast
toast.show('Profile saved successfully!', 'success');

// Show error toast
toast.show('Please fill in all required fields', 'danger');
```

### Modal (JavaScript)
```javascript
// Open modal
modal.open('confirm-dialog');

// Close modal
modal.close();
```

## 🔧 Customization

### Changing Colors
Edit `public/css/tokens.css`:
```css
:root {
  --color-primary: #4F46E5;  /* Change to your brand color */
  --color-secondary: #14B8A6;
  /* ... */
}
```

### Changing Typography
Update the font family in `tokens.css`:
```css
:root {
  --font-family: 'Your Font', sans-serif;
}
```

Add the font in your HTML:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Adjusting Spacing
Modify spacing scale in `tokens.css`:
```css
:root {
  --space-4: 1rem;  /* Adjust base spacing */
}
```

## 📊 Screening Logic

### Score Calculation
- Each question scored 0-4 (Never to Very Often)
- Total score per disorder
- Threshold-based interpretation

### Thresholds (Example)
```javascript
const thresholds = {
  ASD: {
    low: 20,
    moderate: 40,
    high: 60
  },
  ADHD: {
    low: 25,
    moderate: 50,
    high: 75
  },
  Dyslexia: {
    low: 25,
    moderate: 50,
    high: 75
  }
};
```

### Interpretation
- **Low**: No significant indicators
- **Moderate**: Some indicators - consider consultation
- **High**: Multiple indicators - professional evaluation recommended

## 🏥 Therapist Finder

### Features
- Search by city/state
- Filter by disorder specialization
- Sort by distance (placeholder)
- Interactive map (placeholder)
- Contact information
- Save favorite centers

### Data Structure
```json
{
  "id": "center_001",
  "name": "Bright Futures Therapy Center",
  "specializations": ["ASD", "ADHD"],
  "address": "123 Main Street",
  "city": "Kuala Lumpur",
  "state": "Wilayah Persekutuan",
  "phone": "+60-3-1234-5678",
  "email": "info@brightfutures.my",
  "website": "https://brightfutures.my",
  "hours": "Mon-Fri: 9AM-6PM",
  "coordinates": {
    "lat": 3.1390,
    "lng": 101.6869
  }
}
```

## 🖨️ Print Styles

Results pages include print-optimized styles:
- Hide navigation and interactive elements
- Black and white color scheme
- Page break controls
- Print-friendly layout

Trigger print:
```javascript
window.print();
```

## 🚀 Future Enhancements

### Phase 2
- [ ] Dark mode support
- [ ] Additional languages (Chinese, Tamil)
- [ ] Offline support with Service Worker
- [ ] PDF export for results
- [ ] Email results to parent/doctor

### Phase 3
- [ ] Integration with real map API
- [ ] Appointment booking
- [ ] Progress tracking over time
- [ ] Multi-child comparison
- [ ] Professional dashboard

## 📞 Support

For questions or customization help:
- Create an issue on GitHub
- Email: support@detectiontodirection.my
- Documentation: https://docs.detectiontodirection.my

## 📄 License

Copyright © 2025 Detection to Direction. All rights reserved.

---

**Last Updated**: January 2025
**Version**: 2.0.0
**Design System**: v1.0.0
