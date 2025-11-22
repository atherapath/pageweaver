# ✨ pageweaver — Ritual HTML Invocation Engine - glyph engine

**page-weaver** is a model-agnostic invocation engine for sovereign web fragments. It renders modular glyphs—chapters, logs, protests, poems—based on hash or query string alone. No duplication. No redesign. Just clean HTML, sovereign CSS, and invocation-bound JavaScript.

---

## 🔮 Purpose

Each link becomes a spell. It loads its own `.md`, `.jpg`, and `.mp4` based on the hash or query string in the URL.

---

## ✅ Naming Convention & Media Behaviour

The system uses a parallel, number-only naming convention with no spaces, hyphens, or underscores.  
Every part of the engine (markdown, sections, gallery, images, videos) derives behaviour purely from these numeric names.

### 1. Weekly Markdown File (Master File)

Each week has one main markdown file

WWDDYY1.md

Where
- WW = week of the year  
- DD = date the week starts  
- YY = year (last two digits)  
- 1 = first (usually only) markdown file for that week  

Example

4725251.md

### 2. Weekly Gallery Media

Weekly images and videos follow the same base name

Images: WWDDYY1.jpg, WWDDYY2.jpg, WWDDYY3.jpg  
Videos: WWDDYY1.mp4, WWDDYY2.mp4, WWDDYY3.mp4  

Up to three of each may exist. They appear on the week’s page in their dedicated slots, cycling independently for images if desired. If a video is missing, the layout remains clean.

### 3. Section Identifiers Inside the Markdown File

Each section inside the weekly markdown file uses a date-based number

DDMMYYX

Where
- DDMMYY = exact date of entry  
- X = section index (1, 2, 3…) for that date  

Examples

2511251   (25 Nov 25, first section)  
2611251   (26 Nov 25, first section)  
2611252   (26 Nov 25, second section)

Each section may have up to three corresponding images and three MP4s:

Images: DDMMYY1.jpg, DDMMYY2.jpg, DDMMYY3.jpg  
Videos: DDMMYY1.mp4, DDMMYY2.mp4, DDMMYY3.mp4

### 4. Slideshow Behaviour

- Default: cycles weekly images only (6-second loop)  
- Opening a section: gallery switches to section images only; MP4s appear in their slots if they exist  
- Section closed: gallery returns to weekly images; MP4s clear if section videos were displayed  
- Missing media is skipped; layout remains clean

### 5. Summary of Patterns

Weekly markdown file: WWDDYY1.md  
Weekly images: WWDDYY1.jpg → WWDDYY2.jpg → WWDDYY3.jpg  
Weekly videos: WWDDYY1.mp4 → WWDDYY2.mp4 → WWDDYY3.mp4  
Sections: DDMMYY1, DDMMYY2, DDMMYY3  
Section images: DDMMYY1.jpg → DDMMYY2.jpg → DDMMYY3.jpg  
Section videos: DDMMYY1.mp4 → DDMMYY2.mp4 → DDMMYY3.mp4

---

## 🧱 Structure

1. Minimal HTML glyph.html  
2. Auto-loaded markdown from entryName.md  
3. Auto-loaded images from entryName.jpg  
4. Auto-loaded videos from entryName.mp4  
5. Auto-generated title from filename (replace numbers for human-readable display)  
6. Optional overrides removed — all invocation is hash-driven

---

## ⚙️ Invocation Logic

pageweaver.js performs

- Hash parsing glyph.html#slug_name  
- References the json file as described below for all its data
- passes MD styling into HTML styling

### 🌀 Pageweaver Data Workflow (Pre-Processing & Browser Rendering)

1. Markdown Commit → GitHub Action
   - On addition or commit of a weekly `.md` file (WWDDYY1.md), a GitHub Action triggers.
   - The Action extracts all structured data: sections, images, MP4s, titles.
   - Data is compiled into an adjacent JSON file (`WWDDYY1.json`) for browser consumption.

2. Browser: glyph.html + pageweaver.js
   - Does not parse Markdown.
   - Loads the precomputed JSON (`WWDDYY1.json`).
   - Reads section structure, gallery images, and MP4 slots.
   - Handles:
     - Weekly gallery cycling
     - Section opening/closing
     - Video slot updates
   - Layout remains clean even if some media is missing.

3. Flow Summary
   - MD commit → GitHub Action → JSON adjacent file
   - Browser: glyph.html + pageweaver.js → load JSON → render images/videos/sections

4. Benefits
   - Offloads heavy processing from client → faster page loads.
   - Ensures numeric naming conventions and data validation before page render.
   - Keeps JS minimal, hash-driven, and fully deterministic.

---

## 📌 Usage Notes

1. Add weekly markdown files using WWDDYY1.md  
2. Add corresponding images and MP4s following numeric rules  
3. Organize sections with date-number for gallery/media auto-link  
4. No page reloads required — gallery and MP4 slots update dynamically  
5. Keep file names strictly numeric

---

## 🖼️ Diagram: Numeric Relationships (Vertical Tree with MP4s)

Example for week 47 starting 25 November 25

4725251.md  (weekly file)
├─ Images
│   ├─ 4725251.jpg
│   ├─ 4725252.jpg
│   └─ 4725253.jpg
├─ Videos
│   ├─ 4725251.mp4
│   ├─ 4725252.mp4
│   └─ 4725253.mp4
├─ Sections
│   ├─ 2511251  (25 Nov 25, first section)
│   │   ├─ Images
│   │   │   ├─ 2511251.jpg
│   │   │   └─ 2511252.jpg
│   │   └─ Videos
│   │       ├─ 2511251.mp4
│   │       └─ 2511252.mp4
│   ├─ 2611251  (26 Nov 25, first section)
│   │   ├─ Images
│   │   │   ├─ 2611251.jpg
│   │   │   ├─ 2611252.jpg
│   │   │   └─ 2611253.jpg
│   │   └─ Videos
│   │       ├─ 2611251.mp4
│   │       ├─ 2611252.mp4
│   │       └─ 2611253.mp4
│   └─ 2611252  (26 Nov 25, second section)
│       ├─ Images
│       │   ├─ 2611252.jpg
│       │   └─ 2611253.jpg
│       └─ Videos
│           ├─ 2611252.mp4
│           └─ 2611253.mp4

Gallery Behaviour
- Default: cycles through weekly images  
- Opening a section: section images appear; section videos appear in slots  
- Closing a section: returns to weekly images; videos disappear if section videos were displayed

Sexy flow diagram
[pageweaver_readme](pageweaver_readme.jpg)

End of README