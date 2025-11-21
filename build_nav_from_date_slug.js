// build_nav_from_date_slug.js
// PageWeaver / AtheraPath — Navigation builder for DD_MM_YY_N glyphs
// - Links: [slug](glyph.html#slug)
// - Stubs: first sentence from *_top.md first line
// - Nav: auto-appended or auto-replaced "## Navigation" block at bottom

const fs = require("fs");
const path = require("path");

const ROOT_DIR = ".";
const NAV_HEADER = "## Navigation";
const OLD_NAV_START = "<!-- NAV:START -->";

// Walk repo and collect all .md files
function walkDir(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if ([".git", "node_modules", "out"].includes(entry.name)) continue;
      walkDir(fullPath, list);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      list.push(fullPath);
    }
  }

  return list;
}

// Parse *_bottom.md → slug + date info
// Example: 20_11_25_1_bottom.md
function parseBottomFile(absPath) {
  const rel = path.relative(process.cwd(), absPath).replace(/\\/g, "/");
  const base = path.basename(rel);

  if (!base.toLowerCase().endsWith("_bottom.md")) return null;

  const m = base.match(/^(\d{1,2})_(\d{1,2})_(\d{2})_(\d+)_bottom\.md$/i);
  if (!m) return null;

  let [_, dd, mm, yy, idx] = m;

  dd = dd.padStart(2, "0");
  mm = mm.padStart(2, "0");

  const numericKey = parseInt(`20${yy}${mm}${dd}`, 10); // YYYYMMDD
  const dateLabel = `${dd}_${mm}_${yy}`;
  const slug = `${dateLabel}_${idx}`;

  return { relPath: rel, slug, dateLabel, idx, numericKey };
}

// Parse *_top.md → slug
// Example: 20_11_25_1_top.md
function parseTopFile(absPath) {
  const rel = path.relative(process.cwd(), absPath).replace(/\\/g, "/");
  const base = path.basename(rel);

  if (!base.toLowerCase().endsWith("_top.md")) return null;

  const m = base.match(/^(\d{1,2})_(\d{1,2})_(\d{2})_(\d+)_top\.md$/i);
  if (!m) return null;

  let [_, dd, mm, yy, idx] = m;

  dd = dd.padStart(2, "0");
  mm = mm.padStart(2, "0");

  const dateLabel = `${dd}_${mm}_${yy}`;
  const slug = `${dateLabel}_${idx}`;

  return { relPath: rel, slug, dateLabel, idx };
}

// Build slug → stub map: first sentence of first line from *_top.md
function buildStubMap(allMd) {
  const map = new Map();

  for (const file of allMd) {
    const meta = parseTopFile(file);
    if (!meta) continue;

    const content = fs.readFileSync(file, "utf8");
    const firstLine = content.split(/\r?\n/)[0].trim() || meta.slug;

    // Extract first sentence ending with . ! or ?
    const sentenceMatch = firstLine.match(/^(.+?[.!?])(\s|$)/);
    const stub = sentenceMatch ? sentenceMatch[1].trim() : firstLine;

    map.set(meta.slug, stub);
  }

  return map;
}

// Group bottom files by date numericKey (YYYYMMDD)
function groupByDate(bottomFiles) {
  const byDate = new Map();

  for (const f of bottomFiles) {
    if (!byDate.has(f.numericKey)) byDate.set(f.numericKey, []);
    byDate.get(f.numericKey).push(f);
  }

  const keys = [...byDate.keys()].sort((a, b) => a - b);

  // Sort files within each date by slug
  for (const key of keys) {
    byDate.get(key).sort((a, b) => a.slug.localeCompare(b.slug));
  }

  return { byDate, keys };
}

// Build navigation block markdown
function buildNavBlock(current, siblings, prevDay, nextDay, stubBySlug) {
  const stubOf = (slug) => stubBySlug.get(slug) || slug;
  const href = (slug) => `glyph.html#${slug}`;

  let md = "";
  md += `${NAV_HEADER}\n\n`;

  // Previous day
  if (prevDay && prevDay.files.length > 0) {
    const first = prevDay.files[0];
    md += `Previous day: [${first.slug}](${href(first.slug)})\n`;
    md += `${stubOf(first.slug)}\n\n`;
  }

  // Next day
  if (nextDay && nextDay.files.length > 0) {
    const first = nextDay.files[0];
    md += `Next day: [${first.slug}](${href(first.slug)})\n`;
    md += `${stubOf(first.slug)}\n\n`;
  }

  // Siblings (same day, different glyphs)
  const others = siblings.filter((s) => s.relPath !== current.relPath);

  if (others.length > 0) {
    md += `More glyphs from this day:\n`;
    for (const sib of others) {
      md += `- [${sib.slug}](${href(sib.slug)})\n`;
      md += `  ${stubOf(sib.slug)}\n`;
    }
    md += `\n`;
  }

  return md;
}

// Insert or replace the navigation section in a bottom file
function upsertNavBlock(filePath, navBlock) {
  const raw = fs.readFileSync(filePath, "utf8");

  // 1) Prefer explicit "## Navigation" if present
  let idx = raw.indexOf(NAV_HEADER);

  // 2) Fallback: if no header yet but old NAV markers exist, use that as cut point
  if (idx === -1) {
    const oldIdx = raw.indexOf(OLD_NAV_START);
    if (oldIdx !== -1) {
      idx = oldIdx;
    }
  }

  let newContent;

  if (idx !== -1) {
    // Replace everything from the nav marker/header downwards
    const before = raw.slice(0, idx).trimEnd();
    newContent = before + "\n\n" + navBlock + "\n";
  } else {
    // No nav yet: append at the bottom
    newContent = raw.trimEnd() + "\n\n" + navBlock + "\n";
  }

  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`Updated nav in: ${filePath}`);
}

// Main driver
function main() {
  const allMd = walkDir(ROOT_DIR);

  const stubMap = buildStubMap(allMd);

  const bottoms = allMd
    .map(parseBottomFile)
    .filter(Boolean);

  if (bottoms.length === 0) {
    console.log("No *_bottom.md files found.");
    return;
  }

  const { byDate, keys } = groupByDate(bottoms);

  const days = new Map();
  for (const k of keys) {
    days.set(k, { numericKey: k, files: byDate.get(k) });
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const prev = i > 0 ? days.get(keys[i - 1]) : null;
    const next = i < keys.length - 1 ? days.get(keys[i + 1]) : null;

    const currentDay = days.get(key);
    const siblings = currentDay.files;

    for (const bottomFile of siblings) {
      const navBlock = buildNavBlock(bottomFile, siblings, prev, next, stubMap);
      upsertNavBlock(bottomFile.relPath, navBlock);
    }
  }
}

main();
