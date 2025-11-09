#!/bin/bash

# Comprehensive News Sources Verification Script
# Tests all RSS feeds in NEWS_SOURCES_JSON.json to verify they work
# Usage: ./verify_all_sources.sh

MCP_SERVER="https://web3news-mcp-server.vercel.app/api/server"
JSON_FILE="NEWS_SOURCES_JSON.json"
OUTPUT_FILE="VERIFIED_SOURCES.json"
FAILED_SOURCES="FAILED_SOURCES.txt"

echo "🧪 Starting comprehensive source verification..."
echo ""

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "❌ Error: jq is required but not installed. Install with: brew install jq"
    exit 1
fi

# Check if JSON file exists
if [ ! -f "$JSON_FILE" ]; then
    echo "❌ Error: $JSON_FILE not found"
    exit 1
fi

# Initialize arrays
verified_sources=()
failed_sources=()
total=$(jq 'length' "$JSON_FILE")
current=0

echo "📊 Total sources to test: $total"
echo ""

# Read JSON and test each source
while IFS= read -r source_json; do
    current=$((current + 1))
    name=$(echo "$source_json" | jq -r '.name')
    url=$(echo "$source_json" | jq -r '.url')
    category=$(echo "$source_json" | jq -r '.category')
    
    echo "[$current/$total] Testing: $name ($category)..."
    
    # Test via MCP server
    response=$(curl -s -X POST "$MCP_SERVER" \
        -H "Content-Type: application/json" \
        -d "{
            \"jsonrpc\": \"2.0\",
            \"id\": $current,
            \"method\": \"tools/call\",
            \"params\": {
                \"name\": \"get_rss_feed\",
                \"arguments\": {
                    \"feed_url\": \"$url\"
                }
            }
        }" \
        --max-time 30)
    
    # Check if request succeeded
    if echo "$response" | jq -e '.result.content[0].text' > /dev/null 2>&1; then
        text=$(echo "$response" | jq -r '.result.content[0].text')
        
        # Check if we got actual content (not error)
        if [[ "$text" == *"Entry"* ]] || [[ "$text" == *"item"* ]] || [[ "$text" == *"title"* ]]; then
            echo "  ✅ SUCCESS"
            verified_sources+=("$source_json")
        else
            echo "  ❌ FAILED: No valid content"
            failed_sources+=("$name|$url|$category")
            echo "$name|$url|$category" >> "$FAILED_SOURCES"
        fi
    else
        error=$(echo "$response" | jq -r '.error.message // "Unknown error"' 2>/dev/null || echo "Network/Parse error")
        echo "  ❌ FAILED: $error"
        failed_sources+=("$name|$url|$category")
        echo "$name|$url|$category|$error" >> "$FAILED_SOURCES"
    fi
    
    # Small delay to avoid rate limiting
    sleep 0.5
    
done < <(jq -c '.[]' "$JSON_FILE")

# Write verified sources to new JSON file
echo ""
echo "📝 Writing verified sources to $OUTPUT_FILE..."
printf "[" > "$OUTPUT_FILE"
for i in "${!verified_sources[@]}"; do
    if [ $i -gt 0 ]; then
        printf "," >> "$OUTPUT_FILE"
    fi
    printf "%s" "${verified_sources[$i]}" >> "$OUTPUT_FILE"
done
printf "]" >> "$OUTPUT_FILE"

# Format JSON
jq '.' "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp" && mv "${OUTPUT_FILE}.tmp" "$OUTPUT_FILE"

# Summary
verified_count=${#verified_sources[@]}
failed_count=${#failed_sources[@]}

echo ""
echo "════════════════════════════════════════"
echo "📊 VERIFICATION SUMMARY"
echo "════════════════════════════════════════"
echo "✅ Verified: $verified_count sources"
echo "❌ Failed: $failed_count sources"
echo "📁 Verified sources saved to: $OUTPUT_FILE"
echo "📁 Failed sources saved to: $FAILED_SOURCES"
echo ""

if [ $failed_count -gt 0 ]; then
    echo "⚠️  Failed sources:"
    cat "$FAILED_SOURCES" | while IFS='|' read -r name url category error; do
        echo "  - $name ($category)"
    done
fi

echo ""
echo "✅ Verification complete!"

