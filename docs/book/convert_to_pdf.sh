#!/bin/bash
# PDF Conversion Script for The Genesis Protocol Book
# This script converts the combined manuscript to PDF format

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

MANUSCRIPT="COMPLETE_MANUSCRIPT.md"
OUTPUT_PDF="THE_GENESIS_PROTOCOL_BOOK.pdf"

echo "=== Converting The Genesis Protocol Book to PDF ==="
echo ""

# Check for pandoc
if command -v pandoc &> /dev/null; then
    echo "✓ Found pandoc"
    echo "Converting to PDF..."
    
    pandoc "$MANUSCRIPT" \
        -o "$OUTPUT_PDF" \
        --pdf-engine=xelatex \
        -V geometry:margin=1in \
        -V fontsize=11pt \
        -V documentclass=book \
        --toc \
        --toc-depth=3 \
        --number-sections \
        -V colorlinks=true \
        -V linkcolor=blue \
        -V urlcolor=blue \
        -V toccolor=gray
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ PDF created successfully: $OUTPUT_PDF"
        echo "  File size: $(du -h "$OUTPUT_PDF" | cut -f1)"
    else
        echo "✗ PDF conversion failed"
        exit 1
    fi
else
    echo "✗ pandoc not found"
    echo ""
    echo "Installation options:"
    echo "  Ubuntu/Debian: sudo apt-get install pandoc texlive-xetex"
    echo "  macOS: brew install pandoc"
    echo "  Windows: Download from https://pandoc.org/installing.html"
    echo ""
    echo "Alternative conversion methods:"
    echo "  1. Use online converters:"
    echo "     - https://www.markdowntopdf.com/"
    echo "     - https://dillinger.io/ (export as PDF)"
    echo "     - https://stackedit.io/ (export as PDF)"
    echo ""
    echo "  2. Use VS Code with Markdown PDF extension"
    echo ""
    echo "  3. Use GitBook or similar tools"
    echo ""
    echo "  4. Manual conversion:"
    echo "     - Open COMPLETE_MANUSCRIPT.md in a markdown editor"
    echo "     - Export/Print as PDF"
    exit 1
fi
