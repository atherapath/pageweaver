// build_nav_from_date_slug.js
// Build nav for *_bottom.md using DD_MM_YY_N naming.
// Links go to main files (DD_MM_YY_N.md). Stubs come from *_top.md line 1.

const fs = require("fs");
const path = require("path");

const ROOT_DIR = ".";

const NAV_START = "<!-- NAV:START -->";
const NAV_END = "<!-- NAV:END -->";

function walkDir(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "out") continue;
      walkDir(fullPath, list);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      list.push(fullPath);
    }
  }

  return list;
}

// 20_11_25_1_bottom.md
function parseBottomFile(absPath) {
  const relPath = path.relative(process.cwd(), absPath).replace(/\\/g, "/");
  const base = path.basename(relPath);
  if (!base.toLowerCase().endsWith("_bottom.md")) return null;

  const nameWithoutExt = base.replace(/\.md$/i, "");
  const m = nameWithoutExt.match(/^(\d{1,2})_(\d{1,2})_(\d{2})_(\d+)_bottom$/);
  if (!m) return null;

  let [_, dd, mm, yy, idx] = m;
  dd = dd.padStart(2, "0");
  mm = mm.padStart(2, "0");

  const yearFull = 2000 + parseInt(yy, 10);
  const numericKey = parseInt(`${yearFull}${mm}${dd}`, 10);
  const dateLabel = `${dd}_${mm}_${yy}`;
  const slug = `${dateLabel}_${idx}`;

  return { relPath, base, slug, dateLabel, idx, numericKey };
}

// 20_11_25_1_top.md
function parseTopFile(absPath) {
  const relPath = path.relative(process.cwd(), absPath).replace(/\\/g, "/");
  const base = path.basename(relPath);
  if (!base.toLowerCase().endsWith("_top.md")) return null;

  const nameWithoutExt = base.replace(/\.md$/i, "");
  const m = nameWithoutExt.match(/^(\d{1,2})_(\d{1,2})_(\d{2})_(\d+)_top$/);
  if (!m) return null;

  let [_, dd, mm, yy, idx] = m;
  dd = dd.padStart(2, "0");
  mm = mm.padStart(2, "0");

  const dateLabel = `${dd}_${mm}_${yy}`;
  const slug = `${dateLabel}_${idx}`;

  return { relPath, base, slug, dateLabel, idx };
}

// 20_11_25_1.md (main)
function parseMainFile(absPath) {
  const relPath = path.relative(process.cwd(), absPath).replace(/\\/g, "/");
  const base = path.basename(relPath);

  if (base.toLowerCase().endsWith("_top.md")) return null;
  if (base.toLowerCase().endsWith("_bottom.md")) return null;
  if (!base.toLowerCase().endsWith(".md")) return null;

  const nameWithoutExt = base.replace(/\.md$/i, "");
  const m = nameWithoutExt.match(/^(\d{1,2})_(\d{1,2})_(\d{2})_(\d+)$/);
  if (!m) return null;

  let [_, dd, mm, yy, idx] = m;
  dd = dd.padStart(2, "0");
  mm = mm.padStart(2, "0");

  const dateLabel = `${dd}_${mm}_${yy}`;
  const slug = `${dateLabel}_${idx}`;

  return { relPath, base, slug, dateLabel, idx };
}

function groupByDate(files) {
  const byDate = new Map();

  for (const f of files) {
    if (!byDate.has(f.numericKey)) byDate.set(f.numericKey, []);
    byDate.get(f.numericKey).push(f);
  }

  const dateKeys = Array.from(byDate.keys()).sort((a, b) => a - b);

  for (const key of dateKeys) {
    const list = byDate.get(key);
    list.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  return { byDate, dateKeys };
}

function buildStubMap(allMdPaths) {
  const stubBySlug = new Map();

  for (const file of allMdPaths) {
    const meta = parseTopFile(file);
    if (!meta) continue;

    const content = fs.readFileSync(file, "utf8");
    const firstLine = content.split(/\r?\n/)[0].trim();
    const stub = firstLine || meta.slug;

    stubBySlug.set(meta.slug, stub);
  }

  return stubBySlug;
}

function buildMainMap(allMdPaths) {
  const mainBySlug = new Map();

  for (const file of allMdPaths) {
    const meta = parseMainFile(file);
    if (!meta) continue;
    mainBySlug.set(meta.slug, meta);
  }

  return mainBySlug;
}

function buildNavBlock(currentBottom, siblingsForDate, prevDateData, nextDateData, stubBySlug, mainBySlug) {
  const getStub = (slug) => stubBySlug.get(slug) || slug;

  const linkFrom = (fromFile, toFileMeta) => {
    const fromDir = path.dirname(fromFile.relPath);
    const rel = path.relative(fromDir, toFileMeta.relPath).replace(/\\/g, "/");
    return rel || path.basename(toFileMeta.relPath);
  };

  let md = "";
  md += `${NAV_START}\n`;
  md += `<!-- Auto-generated navigation. Do not edit this block by hand. -->\n\n`;
  md += `## Navigation\n\n`;

  // Previous day
  if (prevDateData) {
    const prevBottom = prevDateData.files[0];
    const prevMain = mainBySlug.get(prevBottom.slug);
    if (prevMain) {
      const link = linkFrom(currentBottom, prevMain);
      const stub = getStub(prevBottom.slug);
      md += `**[Previous day →](${link})**\n`;
      md += `${stub}\n\n`;
    }
  }

  // Next day
  if (nextDateData) {
    const nextBottom = nextDateData.files[0];
    const nextMain = mainBySlug.get(nextBottom.slug);
    if (nextMain) {
      const link = linkFrom(currentBottom, nextMain);
      const stub = getStub(nextBottom.slug);
      md += `**[Next day →](${link})**\n`;
      md += `${stub}\n\n`;
    }
  }

  // Siblings
  const otherSiblings = siblingsForDate.filter(
    (f) => f.relPath !== currentBottom.relPath
  );

  if (otherSiblings.length > 0) {
    md += `**More glyphs from this day**\n\n`;

    for (const sib of otherSiblings) {
      const sibMain = mainBySlug.get(sib.slug);
      if (!sibMain) continue;

      const link = linkFrom(currentBottom, sibMain);
      const stub = getStub(sib.slug);

      md += `**[Related glyph →](${link})**\n`;
      md += `${stub}\n\n`;
    }
  }

  md += `${NAV_END}\n`;
  return md;
}

function upsertNavBlock(filePath, navBlock) {
  const raw = fs.readFileSync(filePath, "utf8");

  const startIdx = raw.indexOf(NAV_START);
  const endIdx = raw.indexOf(NAV_END);

  let newContent;

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const before = raw.slice(0, startIdx).trimEnd();
    const after = raw.slice(endIdx + NAV_END.length).trimStart();
    newContent = before + "\n\n" + navBlock + "\n" + (after ? "\n" + after : "");
  } else {
    const trimmed = raw.trimEnd();
    newContent = trimmed + "\n\n" + navBlock + "\n";
  }

  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`Updated nav in: ${filePath}`);
}

function main() {
  const rootPath = path.join(process.cwd(), ROOT_DIR);
  if (!fs.existsSync(rootPath)) {
    console.error(`ROOT_DIR '${ROOT_DIR}' does not exist.`);
    process.exit(1);
  }

  const allMd = walkDir(rootPath);
  const stubBySlug = buildStubMap(allMd);
  const mainBySlug = buildMainMap(allMd);

  const bottoms = [];
  for (const file of allMd) {
    const meta = parseBottomFile(file);
    if (meta) bottoms.push(meta);
  }

  if (bottoms.length === 0) {
    console.log("No date-based *_bottom.md files found. Nothing to do.");
    return;
  }

  const { byDate, dateKeys } = groupByDate(bottoms);

  const daysData = new Map();
  for (const key of dateKeys) {
    const files = byDate.get(key);
    const dateLabel = files[0].dateLabel;
    daysData.set(key, { numericKey: key, dateLabel, files });
  }

  for (let i = 0; i < dateKeys.length; i++) {
    const key = dateKeys[i];
    const currentDay = daysData.get(key);
    const prevDay = i > 0 ? daysData.get(dateKeys[i - 1]) : null;
    const nextDay = i < dateKeys.length - 1 ? daysData.get(dateKeys[i + 1]) : null;

    const siblings = currentDay.files;

    for (const bottomFile of siblings) {
      const navBlock = buildNavBlock(
        bottomFile,
        siblings,
        prevDay,
        nextDay,
        stubBySlug,
        mainBySlug
      );
      upsertNavBlock(bottomFile.relPath, navBlock);
    }
  }
}

main();
