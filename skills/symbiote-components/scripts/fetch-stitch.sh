#!/bin/bash
# Fetch Stitch HTML source code with proper redirect handling.
# Usage: bash scripts/fetch-stitch.sh "<downloadUrl>" "<output_path>"

URL="$1"
OUTPUT="${2:-temp/source.html}"

if [ -z "$URL" ]; then
  echo "Error: URL is required"
  echo "Usage: bash fetch-stitch.sh \"<downloadUrl>\" \"<output_path>\""
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT")"

echo "Downloading Stitch HTML from: $URL"
curl -L -o "$OUTPUT" \
  -H "Accept: text/html" \
  --max-redirs 5 \
  --retry 3 \
  "$URL"

if [ $? -eq 0 ] && [ -s "$OUTPUT" ]; then
  echo "Saved to: $OUTPUT ($(wc -c < "$OUTPUT") bytes)"
else
  echo "Error: Download failed or file is empty"
  exit 1
fi
