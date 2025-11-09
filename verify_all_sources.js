#!/usr/bin/env node

/**
 * Comprehensive News Sources Verification Script
 * Tests all RSS feeds in NEWS_SOURCES_JSON.json via MCP server
 * Creates VERIFIED_SOURCES.json with only working sources
 */

import fs from 'fs';
import https from 'https';

const MCP_SERVER = 'https://web3news-mcp-server.vercel.app/api/server';
const INPUT_FILE = 'NEWS_SOURCES_JSON.json';
const OUTPUT_FILE = 'VERIFIED_SOURCES.json';
const FAILED_FILE = 'FAILED_SOURCES.json';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 30000, // 30 second timeout
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (error) {
          reject(new Error(`JSON parse error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
}

async function testSource(source, index, total) {
  const { name, url, category } = source;
  
  process.stdout.write(`[${index}/${total}] Testing: ${name.substring(0, 40).padEnd(40)} ... `);

  try {
    const requestData = JSON.stringify({
      jsonrpc: '2.0',
      id: index,
      method: 'tools/call',
      params: {
        name: 'get_rss_feed',
        arguments: {
          feed_url: url,
        },
      },
    });

    const response = await makeRequest(MCP_SERVER, requestData);

    // Check if request succeeded
    if (response.error) {
      log(`❌ FAILED: ${response.error.message || 'Unknown error'}`, 'red');
      return { success: false, source, error: response.error.message || 'Unknown error' };
    }

    const text = response.result?.content?.[0]?.text || '';

    // Check if we got actual content
    if (text.includes('Entry') || text.includes('item') || text.includes('title') || text.match(/##\s+\d+\./)) {
      log(`✅ SUCCESS`, 'green');
      return { success: true, source };
    } else {
      log(`❌ FAILED: No valid content`, 'red');
      return { success: false, source, error: 'No valid RSS content returned' };
    }
  } catch (error) {
    log(`❌ FAILED: ${error.message}`, 'red');
    return { success: false, source, error: error.message };
  }
}

async function main() {
  log('\n🧪 Starting comprehensive source verification...\n', 'cyan');

  // Read input file
  if (!fs.existsSync(INPUT_FILE)) {
    log(`❌ Error: ${INPUT_FILE} not found`, 'red');
    process.exit(1);
  }

  const sources = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  const total = sources.length;
  
  log(`📊 Total sources to test: ${total}\n`, 'blue');

  const verified = [];
  const failed = [];
  let current = 0;

  // Test each source
  for (const source of sources) {
    current++;
    const result = await testSource(source, current, total);
    
    if (result.success) {
      verified.push(result.source);
    } else {
      failed.push({
        ...result.source,
        error: result.error,
      });
    }

    // Small delay to avoid rate limiting (500ms between requests)
    if (current < total) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Write verified sources
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(verified, null, 2));
  
  // Write failed sources
  fs.writeFileSync(FAILED_FILE, JSON.stringify(failed, null, 2));

  // Summary
  const verifiedCount = verified.length;
  const failedCount = failed.length;
  const successRate = ((verifiedCount / total) * 100).toFixed(1);

  log('\n═══════════════════════════════════════════════════════════', 'cyan');
  log('📊 VERIFICATION SUMMARY', 'cyan');
  log('═══════════════════════════════════════════════════════════\n', 'cyan');
  
  log(`✅ Verified: ${verifiedCount} sources (${successRate}%)`, 'green');
  log(`❌ Failed: ${failedCount} sources`, 'red');
  log(`📁 Verified sources saved to: ${OUTPUT_FILE}`, 'blue');
  log(`📁 Failed sources saved to: ${FAILED_FILE}\n`, 'yellow');

  // Show failed sources summary
  if (failedCount > 0) {
    log('⚠️  Failed Sources:', 'yellow');
    failed.forEach((source, index) => {
      log(`  ${index + 1}. ${source.name} (${source.category}) - ${source.error}`, 'red');
    });
    log('');
  }

  // Category breakdown
  log('📊 Verified Sources by Category:', 'blue');
  const byCategory = {};
  verified.forEach(source => {
    byCategory[source.category] = (byCategory[source.category] || 0) + 1;
  });
  Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    log(`  ${cat.padEnd(15)}: ${count} sources`, 'cyan');
  });

  log('\n✅ Verification complete!\n', 'green');
  log(`💡 Use ${OUTPUT_FILE} for GitHub Secrets (NEWS_SOURCES_JSON)`, 'blue');
}

main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
