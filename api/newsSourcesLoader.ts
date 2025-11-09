/**
 * News Sources Configuration Loader
 * Loads news sources from environment variables or falls back to default sources
 * 
 * Environment Variables:
 * - NEWS_SOURCES_JSON: JSON string with array of news sources
 * - NEWS_SOURCES_FILE: Path to JSON file (for local development)
 * 
 * Format:
 * [
 *   {
 *     "name": "Source Name",
 *     "url": "https://example.com/rss",
 *     "category": "tech",
 *     "language": "en",
 *     "verified": true
 *   }
 * ]
 */

import type { NewsSource } from './newsSources';
import { NEWS_SOURCES as DEFAULT_SOURCES } from './newsSources';

/**
 * Load news sources from environment variables
 */
export function loadNewsSourcesFromEnv(): NewsSource[] {
  // Try loading from environment variable (GitHub Secrets)
  const envSourcesJson = process.env.NEWS_SOURCES_JSON;
  
  if (envSourcesJson) {
    try {
      const parsed = JSON.parse(envSourcesJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`[MCP Config] ✅ Loaded ${parsed.length} news sources from environment variables`);
        return parsed as NewsSource[];
      }
    } catch (error) {
      console.error('[MCP Config] ❌ Failed to parse NEWS_SOURCES_JSON:', error);
    }
  }

  // Fallback to default sources
  console.log(`[MCP Config] ⚠️ Using default news sources (${DEFAULT_SOURCES.length} sources)`);
  return DEFAULT_SOURCES;
}

/**
 * Get news sources (from env or default)
 */
export function getNewsSources(): NewsSource[] {
  return loadNewsSourcesFromEnv();
}

