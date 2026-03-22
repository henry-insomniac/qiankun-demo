#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -lt 5 ]; then
  echo "Usage: $0 <app-name> <route-base> <output-dir> <port> <library-name> [display-name]"
  exit 1
fi

APP_NAME="$1"
ROUTE_BASE="$2"
OUTPUT_DIR="$3"
APP_PORT="$4"
LIBRARY_NAME="$5"
DISPLAY_NAME="${6:-$APP_NAME}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_DIR="$ROOT_DIR/templates/vue3-webpack-micro-app"

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "Template directory not found: $TEMPLATE_DIR"
  exit 1
fi

if [ -e "$OUTPUT_DIR" ]; then
  echo "Output directory already exists: $OUTPUT_DIR"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
cp -R "$TEMPLATE_DIR"/. "$OUTPUT_DIR"

find "$OUTPUT_DIR" -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/dist/*" \
  -print0 | while IFS= read -r -d '' file; do
  perl -0pi -e "s/__APP_NAME__/$APP_NAME/g" "$file"
  perl -0pi -e "s#__APP_ROUTE_BASE__#$ROUTE_BASE#g" "$file"
  perl -0pi -e "s/__APP_PORT__/$APP_PORT/g" "$file"
  perl -0pi -e "s/__APP_LIBRARY__/$LIBRARY_NAME/g" "$file"
  perl -0pi -e "s/__APP_DISPLAY_NAME__/$DISPLAY_NAME/g" "$file"
done

echo "Vue micro app template created at: $OUTPUT_DIR"
echo "Next steps:"
echo "  cd $OUTPUT_DIR"
echo "  pnpm install"
echo "  pnpm dev"
