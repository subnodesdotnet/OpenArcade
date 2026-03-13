#!/usr/bin/env bash
# build.sh — sync source files into dist/ for deployment
# Usage: ./build.sh

set -e

DIST="$(dirname "$0")/dist"

mkdir -p "$DIST/apps"

cp index.html  "$DIST/index.html"
cp style.css   "$DIST/style.css"
cp apps/*.js   "$DIST/apps/"

echo "dist/ updated:"
find "$DIST" -type f | sort
