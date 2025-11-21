# ✨ pageweaver — Ritual HTML Invocation Engine - glyph engine

**page-weaver** is a model-agnostic invocation engine for sovereign web fragments. It renders modular glyphs—chapters, logs, protests, poems—based on hash or query string alone. No duplication. No redesign. Just clean HTML, sovereign CSS, and invocation-bound JavaScript.

---

## 🔮 Purpose

Each link becomes a spell: it loads its own `.md`, `.jpg`, and `.mp4` based on the hash or query string in the URL.

---

## 🧱 Structure

Each invocation consists of:

1. **Minimal HTML** (`glyph.html`)
2. **Auto-loaded markdown**: `entryName.md`
3. **Auto-loaded image**: `entryName.jpg`
4. **Auto-loaded video**: `entryName.mp4`
5. **Auto-generated title**: from `entryName`
6. **Optional overrides** via `<script data-img data-md data-title>`

   Does this overide section still exist?  Section 7 may need to be removed.
7.   - Override any of these by adding attributes to the `<script>` tag in the :
    <script
      src="pageweaver.js"
      data-img="custom.jpg"
      data-md="custom.md"
      data-title="Custom Title">
    </script>
    
---

## ⚙️ Invocation Logic

The JavaScript (`pageweaver.js`) performs:

- **Hash parsing** → `glyph.html#slug_name`
- **Markdown loading** → `slug_name.md`
- **Image loading** → `slug_name.jpg`
- **Video loading** → `slug_name.mp4`
- **Title formatting** → `slug_name` (space replaces underscore, capitialise first letter of each word)
- **Failover** → If media not found, it hides the element
