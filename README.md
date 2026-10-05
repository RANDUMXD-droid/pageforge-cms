# PageForge v2 – Enhanced CMS

All HTML + CSS + JavaScript. Local Storage only. No server needed.

**Run:** open `index.html`

**Demo login:** admin@cms.com / admin123

---

## What's Upgraded

### Rich Text Formatting
- Inline formatting toolbar (bold, italic, links) in editor
- Markdown-style syntax: `**bold**`, `_italic_`, `[link](url)`
- Renders on page view

### More Block Types
- **Gallery** – multiple images with captions
- **Video** – embedded YouTube/Vimeo iframes
- **Code** – syntax highlighting-ready blocks
- **Callout** – highlighted info/warning boxes
- Plus the originals: heading, paragraph, image, button, quote, divider

### Scheduling
- Publish date/time picker per page
- Scheduled tab shows future posts
- Auto-publishes when viewed after the scheduled time
- Admin can publish immediately

### Version History
- Every draft save creates a version snapshot
- Users see version count and timestamps
- Track what changed (block count, updates)

### Comments on Approvals
- Admins leave comments on pages under review
- Author can see feedback before rejection/approval
- Comment thread visible in approval tab

### Page Templates
- Blog post, product page, photo gallery starters
- Pre-filled blocks to get users going fast
- "Use template" button in My Pages

### Dark Mode
- Toggle 🌙 in top bar (any page)
- Preference stored in Local Storage
- CSS variables for theme colors
- Works seamlessly across all pages

### Visual Polish
- Softer shadows, better hover states
- Smoother transitions
- Better spacing and typography
- Responsive grid layouts
- Emoji shortcuts in hero section

---

## Architecture

**Files:**
- `index.html` – Auth (login/signup)
- `admin.html` – Analytics, approvals, scheduling, user roles
- `user.html` – Author dashboard, templates, version history
- `view.html` – Public page viewer
- `js/common.js` – All state logic, editor, rendering
- `css/style.css` – Design system with dark mode

**Data (Local Storage):**
- `users` – accounts with roles
- `pages` – all pages, statuses, metadata
- `comments` – comment threads per page
- `versions` – version snapshots per page
- `dark` – theme preference

---

## Key Features

| Feature | Implementation |
|---------|---|
| Auth | localStorage session, role-based routing |
| Rich text | Markdown-style syntax + toolbar |
| Scheduling | Date picker, `publishDate` field, time checks on view |
| Comments | Stored per-page, shown on approvals |
| Versions | Snapshots on save, tracked per page |
| Templates | Pre-made block sets, users pick on creation |
| Dark mode | CSS variables + toggle, persistent |
| SEO | Title, description, keywords, readability score |
| Drag-drop | HTML5 drag API, block reordering |

---

## For the Demo

1. **Sign up** as User with a new email
2. **Create page** using a template (Blog Post)
3. **Add blocks** – heading, paragraph, gallery
4. **Schedule** it for tomorrow
5. **Submit** for approval
6. **Log in as admin** (admin@cms.com)
7. **Approve** from Approvals tab
8. Show **Scheduled** tab with tomorrow's post
9. Toggle **dark mode** 🌙
10. Explain **version history** in Author view

---

## Passwords

Stored plainly (no backend). Ready to note during review.
