#!/usr/bin/env node

/**
 * Generate minified NEWS_SOURCES_JSON from newsSources.ts
 * This includes all sources including RSSHub sources from Folo
 */

const fs = require('fs');
const path = require('path');

// Read the TypeScript file and extract NEWS_SOURCES array
const newsSourcesPath = path.join(__dirname, 'api', 'newsSources.ts');
const newsSourcesContent = fs.readFileSync(newsSourcesPath, 'utf8');

// Extract the NEWS_SOURCES array using regex
// This is a simple approach - in production you'd use a TypeScript parser
const sourcesMatch = newsSourcesContent.match(/export const NEWS_SOURCES: NewsSource\[\] = \[([\s\S]*?)\];/);

if (!sourcesMatch) {
  console.error('Could not find NEWS_SOURCES array in newsSources.ts');
  process.exit(1);
}

// Parse the sources manually (simplified - assumes valid TypeScript)
const sourcesText = sourcesMatch[1];

// Convert TypeScript object literals to JSON
// This is a simplified parser - handles the basic structure
const sources = [];

// Split by source objects (look for closing brace followed by comma or closing bracket)
const sourceObjects = sourcesText.split(/},\s*(?=\{|$)/);

for (const sourceText of sourceObjects) {
  if (!sourceText.trim() || sourceText.trim().startsWith('//')) continue;
  
  try {
    // Extract name
    const nameMatch = sourceText.match(/name:\s*['"]([^'"]+)['"]/);
    // Extract url
    const urlMatch = sourceText.match(/url:\s*['"]([^'"]+)['"]/);
    // Extract category
    const categoryMatch = sourceText.match(/category:\s*['"]([^'"]+)['"]/);
    // Extract language
    const languageMatch = sourceText.match(/language:\s*['"]([^'"]+)['"]/);
    // Extract verified
    const verifiedMatch = sourceText.match(/verified:\s*(true|false)/);
    
    if (nameMatch && urlMatch && categoryMatch && languageMatch) {
      sources.push({
        name: nameMatch[1],
        url: urlMatch[1],
        category: categoryMatch[1],
        language: languageMatch[1],
        verified: verifiedMatch ? verifiedMatch[1] === 'true' : true,
      });
    }
  } catch (error) {
    // Skip invalid entries
    console.warn('Skipping invalid source:', error.message);
  }
}

// Generate minified JSON
const minifiedJson = JSON.stringify(sources);

// Write to file
const outputPath = path.join(__dirname, 'NEWS_SOURCES_JSON_MINIFIED.txt');
fs.writeFileSync(outputPath, minifiedJson);

console.log(`✅ Generated ${sources.length} sources`);
console.log(`✅ Written to ${outputPath}`);
console.log(`✅ Size: ${(minifiedJson.length / 1024).toFixed(2)} KB`);

// Also write formatted version for reference
const formattedPath = path.join(__dirname, 'NEWS_SOURCES_JSON_COMPLETE.json');
fs.writeFileSync(formattedPath, JSON.stringify(sources, null, 2));
console.log(`✅ Formatted version written to ${formattedPath}`);

