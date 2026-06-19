# Knowledge Vault

Knowledge Vault is a responsive vanilla JavaScript app for managing books and notes in one place. It combines a personal library, note-taking, progress tracking, import/export tools, and theme settings in a single browser-based experience.

## Demo Links

- Live site: [GitHub Pages](https://ben-m-m.github.io/knowledge_vault/)
- Video description: [Video Description](#video-description)

## Overview

The app is designed for students who want to track what they are reading, capture ideas tied to specific books, and keep their data available after refreshes through browser storage. It also includes search and filtering tools, a dashboard summary, and accessible form controls.

## Key Capabilities

### Library Management

- Add new books with title, author, pages, tag, reading status, rating, date added, cover image, and summary.
- Edit, view, and delete saved books.
- Search the library by keywords or regular expressions.
- Toggle case-sensitive search when needed.
- Sort books by title, page count, or date added.
- Import and export book data as JSON.

### Notes Management

- Create notes with a title, body, linked book, and highlight flag.
- Edit, view, and delete notes.
- Search notes across title, content, and linked book.
- Sort notes by newest, oldest, or book title.
- Filter notes to show recent items or highlighted items.
- Import and export notes as JSON.

### Dashboard Insights

- View total books in the library.
- View total pages across all books.
- See the most common tag.
- Track the currently reading book.
- See the most recently added book.
- Compare reading progress against the configured reading goal.

### Settings And Personalization

- Set a reading goal in pages.
- Set a reading speed in pages per hour.
- Choose a preferred unit for display.
- Switch between light and dark themes.
- Persist the selected theme in local storage.

### Accessibility And UX

- Skip link for quick keyboard access.
- Semantic page structure and labeled form controls.
- Live regions for status and validation messages.
- Keyboard-friendly controls.
- Responsive layout styles for smaller screens.

## Video Description

This project walkthrough should show the core user flow:

1. Open the dashboard and explain the summary metrics.
2. Add a book to the library and show the validation and storage behavior.
3. Search, sort, edit, view, and delete a book.
4. Create a note tied to a book, then filter and highlight it.
5. Demonstrate JSON import and export for both books and notes.
6. Toggle the theme and show that the preference persists.

If you have a hosted video link, replace this section link target with the published video URL.

## Getting Started

No build step is required. Open `index.html` directly in a browser, or serve the folder with any static file server.

### Local Run

1. Clone or download the repository.
2. Open the `knowledge_vault` folder in VS Code or your file explorer.
3. Open `index.html` in a browser.

### Deployment

The project is ready for static hosting, including GitHub Pages.

## Project Structure

```text
knowledge_vault/
├── index.html
├── README.md
├── assets/
│   ├── sampledata.json
│   └── images/
│       ├── alu.jpg
│       ├── logo.png
│       ├── placeholder-cover.png
│       └── useravatar.jpg
├── docs/
│   ├── project specifications.md
│   └── wireframes/
├── scripts/
│   ├── app.js
│   ├── books.js
│   ├── dashboard.js
│   ├── notes.js
│   ├── storage.js
│   ├── ui.js
│   └── validation.js
└── styles/
	├── base.css
	├── layout.css
	└── responsive.css
```

## File Notes

- [index.html](index.html) contains the full interface, navigation, forms, and app sections.
- [scripts/storage.js](scripts/storage.js) handles localStorage persistence for books, notes, and theme.
- [scripts/books.js](scripts/books.js) manages book CRUD, search, sort, import, and export.
- [scripts/notes.js](scripts/notes.js) manages note CRUD, search, filters, import, and export.
- [scripts/dashboard.js](scripts/dashboard.js) computes the dashboard totals and reading goal summary.
- [scripts/ui.js](scripts/ui.js) initializes theme handling.
- [scripts/app.js](scripts/app.js) boots the application on page load.
- [docs/project specifications.md](docs/project%20specifications.md) captures the original feature requirements.
- [assets/sampledata.json](assets/sampledata.json) provides starter book data.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage

## Notes

- Book and note data are stored in the browser, so the app works without a backend.
- JSON import/export is available for both books and notes.
- The default sample content can be seeded from [assets/sampledata.json](assets/sampledata.json).