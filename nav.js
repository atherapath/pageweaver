// nav.js — Node.js script to generate a single consolidated PageWeaver JSON
const fs = require('fs');
const path = require('path');

// Configuration
const MD_DIR = './markdown';                // folder containing all weekly markdown files
const OUTPUT_FILE = './data/pageweaver.json'; // single consolidated JSON
const WEEKLY_FILE_REGEX = /^\d{7}\.md$/;   // matches weekly MD files e.g., 4725251.md
const MAX_MEDIA = 3;                        // max number of images/videos per week/section

// Helper: get all images/videos for a base name
function getMediaFiles(baseName, type) {
  const ext = type === 'image' ? '.jpg' : '.mp4';
  const files = [];
  for (let i = 1; i <= MAX_MEDIA; i++) {
    const filePath = path.join(MD_DIR, `${baseName}${i}${ext}`);
    if (fs.existsSync(filePath)) {
      files.push(`${baseName}${i}${ext}`);
    }
  }
  return files;
}

// Helper: extract sections from markdown content
function extractSections(content) {
  const sectionRegex = /^(\d{6}\d)\s*$/gm; // DDMMYYX pattern
  const sections = [];
  let match;
  let lastId = null;
  let lastIndex = 0;

  while ((match = sectionRegex.exec(content)) !== null) {
    if (lastId) {
      const sectionContent = content.substring(lastIndex, match.index).trim();
      sections.push({
        id: lastId,
        title: `${lastId} – Section`,
        content: sectionContent,
        images: getMediaFiles(lastId, 'image'),
        videos: getMediaFiles(lastId, 'video')
      });
    }
    lastId = match[1];
    lastIndex = match.index + match[0].length;
  }

  // Add final section
  if (lastId) {
    const sectionContent = content.substring(lastIndex).trim();
    sections.push({
      id: lastId,
      title: `${lastId} – Section`,
      content: sectionContent,
      images: getMediaFiles(lastId, 'image'),
      videos: getMediaFiles(lastId, 'video')
    });
  }

  return sections;
}

// Main object to hold all weeks
const allWeeks = {};

// Process each markdown file
fs.readdirSync(MD_DIR).forEach(file => {
  if (!WEEKLY_FILE_REGEX.test(file)) return;

  const slug = path.basename(file, '.md');
  const mdPath = path.join(MD_DIR, file);
  const content = fs.readFileSync(mdPath, 'utf-8');

  const sections = extractSections(content);

  allWeeks[slug] = {
    slug,
    title: `Week ${slug.substring(0,2)} – ${slug.substring(2,4)}/${slug.substring(4,6)}/${slug.substring(6,7)}`,
    hero: {
      image: `${slug}1.jpg`,
      caption: 'Weekly hero image'
    },
    weeklyGallery: {
      images: getMediaFiles(slug, 'image'),
      videos: getMediaFiles(slug, 'video')
    },
    sections
  };
});

// Ensure output directory exists
if (!fs.existsSync(path.dirname(OUTPUT_FILE))) fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

// Write the master JSON file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allWeeks, null, 2), 'utf-8');
console.log(`Generated master JSON: ${OUTPUT_FILE}`);