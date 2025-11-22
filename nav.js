// nav.js — Node.js script to generate a single consolidated PageWeaver JSON
const fs = require('fs');
const path = require('path');

// Everything in root
const ROOT_DIR = '.';
const OUTPUT_FILE = './pageweaver.json';
const WEEKLY_FILE_REGEX = /^\d{7}\.md$/;
const MAX_MEDIA = 3;

// Get images/videos for a base name
function getMediaFiles(baseName, type) {
  const ext = type === 'image' ? '.jpg' : '.mp4';
  const files = [];
  for (let i = 1; i <= MAX_MEDIA; i++) {
    const fileName = `${baseName}${i}${ext}`;
    if (fs.existsSync(path.join(ROOT_DIR, fileName))) {
      files.push(fileName);
    }
  }
  return files;
}

// Extract sections from markdown content
function extractSections(content) {
  const sectionRegex = /^(\d{6}\d)\s*$/gm; // DDMMYYX
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

// Main object for all weeks
const allWeeks = {};

// Process each markdown in root
fs.readdirSync(ROOT_DIR).forEach(file => {
  if (!WEEKLY_FILE_REGEX.test(file)) return;

  const slug = path.basename(file, '.md');
  const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf-8');
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

// Write master JSON in root
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allWeeks, null, 2), 'utf-8');
console.log(`Generated master JSON: ${OUTPUT_FILE}`);
