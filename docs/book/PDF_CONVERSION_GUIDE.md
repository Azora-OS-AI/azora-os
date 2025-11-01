# PDF Conversion Guide for Founders Review

## Quick Conversion Methods

### Option 1: Using pandoc (Recommended)

If you have pandoc installed:
```bash
cd /workspace/docs/book
./convert_to_pdf.sh
```

Or manually:
```bash
pandoc COMPLETE_MANUSCRIPT.md -o THE_GENESIS_PROTOCOL_BOOK.pdf \
  --pdf-engine=xelatex \
  --toc \
  --number-sections \
  -V geometry:margin=1in
```

### Option 2: Online Converters

1. **Markdown to PDF** (https://www.markdowntopdf.com/)
   - Upload `COMPLETE_MANUSCRIPT.md`
   - Download PDF

2. **Dillinger** (https://dillinger.io/)
   - Import `COMPLETE_MANUSCRIPT.md`
   - Export as PDF

3. **StackEdit** (https://stackedit.io/)
   - Import file
   - Export as PDF

### Option 3: VS Code

1. Install "Markdown PDF" extension
2. Open `COMPLETE_MANUSCRIPT.md`
3. Right-click → "Markdown PDF: Export (pdf)"

### Option 4: GitBook

1. Import `COMPLETE_MANUSCRIPT.md` to GitBook
2. Export as PDF

### Option 5: Manual Print to PDF

1. Open `COMPLETE_MANUSCRIPT.md` in any markdown viewer
2. Print → Save as PDF

## File Information

- **Complete Manuscript:** `COMPLETE_MANUSCRIPT.md` (3,825 lines)
- **Individual Parts:**
  - Front Matter: `THE_GENESIS_PROTOCOL_BOOK.md`
  - Part I: `PART_I_FOUNDATION.md`
  - Part II: `PART_II_ARCHITECTURE.md`
  - Part III: `PART_III_ECONOMICS.md`
  - Part IV: `PART_IV_IMPLEMENTATION.md`
  - Appendices: `APPENDICES.md`

## For Founder Review

The complete manuscript is ready for PDF conversion. The book includes:

- ✅ Complete front matter (title, copyright, dedication, foreword, preface)
- ✅ Part I: The Foundation (4 chapters)
- ✅ Part II: The Architecture (3 chapters)
- ✅ Part III: The Economic Model (3 chapters)
- ✅ Part IV: Implementation and Future (2 chapters)
- ✅ Appendices (5 sections)

**Total:** ~80,000 words across 12 main chapters + appendices

## Notes

- The manuscript is formatted in Markdown
- PDF conversion preserves formatting
- Table of contents can be auto-generated
- Page numbers and sections are numbered

## Next Steps After PDF Creation

1. Review PDF for formatting issues
2. Check table of contents
3. Verify page breaks
4. Add cover page if needed
5. Send to founders for review
