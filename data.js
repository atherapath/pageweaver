const fs = require('fs');
const path = require('path');
const { marked } = require('marked'); // Markdown → HTML

// Collect lawful files
function collectFiles() {
  return fs.readdirSync('.').filter(f => /^\d+\.(md|jpg|mp4)$/.test(f));
}

// Collect media for a base name
function collectMedia(base, ext) {
  const out = [];
  for (let i = 1; i <= 3; i++) {
    const candidate = `${base}${i}.${ext}`;
    if (fs.existsSync(candidate)) out.push(candidate);
  }
  return out;
}

// Human-readable title
function humanTitle(id) {
  const day = id.slice(0, 2);
  const month = id.slice(2, 4);
  const year = '20' + id.slice(4, 6);
  const sectionIndex = id.slice(6);
  return `${day}/${month}/${year} section ${sectionIndex}`;
}

// Parse weekly markdown into sections
function parseMarkdown(mdFile) {
  const content = fs.readFileSync(mdFile, 'utf-8');
  const sectionRegex = /^(\d{7})\s*$/gm;
  let match;
  const sections = [];

  while ((match = sectionRegex.exec(content)) !== null) {
    const id = match[1];
    const start = match.index + match[0].length;
    const next = sectionRegex.exec(content);
    const end = next ? next.index : content.length;
    const sectionText = content.slice(start, end).trim();

    if (sectionText.length > 0) {
      sections.push({
        id,
        title: humanTitle(id),
        markdown: sectionText,           // raw markdown
        html: marked.parse(sectionText), // converted HTML
        images: collectMedia(id, 'jpg'),
        videos: collectMedia(id, 'mp4')
      });
    }

    if (next) sectionRegex.lastIndex = next.index;
  }
  return sections;
}

// Build JSON
function buildJSON() {
  const files = collectFiles();
  const mdFiles = files.filter(f => f.endsWith('.md'));
  const data = { weeks: [] };

  mdFiles.forEach(mdFile => {
    const base = path.basename(mdFile, '.md');
    const sections = parseMarkdown(mdFile);

    data.weeks.push({
      id: base,
      weeklyGallery: {
        images: collectMedia(base, 'jpg'),
        videos: collectMedia(base, 'mp4')
      },
      sections
    });
  });

  fs.writeFileSync('pageweaver.json', JSON.stringify(data, null, 2));
  console.log('Created pageweaver.json in root');
}

// Run
buildJSON();
