/**
 * IJARST PDF Generator
 *
 * Flow:
 *  1. PDFKit  → generates a polished cover/abstract page (title, authors, abstract, keywords, metadata)
 *  2. pdf-lib → merges cover + uploaded manuscript into one document
 *  3. pdf-lib → stamps IJARST header + footer on EVERY page (cover AND manuscript)
 *
 * Result: readers get the full author manuscript with journal branding on every page.
 */

const PDFDocument = require('pdfkit');
const { PDFDocument: LibPDFDocument, StandardFonts, rgb } = require('pdf-lib');

// ── Colours (same palette as the website) ─────────────────────────────────────
const C = {
  green:      rgb(0.106, 0.369, 0.125),   // #1B5E20
  greenLight: rgb(0.18,  0.49,  0.196),   // #2E7D32
  yellow:     rgb(0.961, 0.769, 0.0),     // #F5C400
  black:      rgb(0.051, 0.051, 0.051),   // #0D0D0D
  gray:       rgb(0.333, 0.333, 0.333),   // #555555
  lightGray:  rgb(0.533, 0.533, 0.533),   // #888888
  veryLight:  rgb(0.8,   0.8,   0.8),     // #CCCCCC
  white:      rgb(1,     1,     1),
  blue:       rgb(0.102, 0.451, 0.910),   // #1a73e8
};

// ── PDFKit constants ───────────────────────────────────────────────────────────
const L = 55;   // left margin (pts)
const R_MARGIN = 55;

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Generate cover/abstract page with PDFKit
// ─────────────────────────────────────────────────────────────────────────────
function generateCoverPage(paper) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: L,
        size: 'A4',
        bufferPages: true,
        info: {
          Title: paper.title || 'Untitled',
          Author: (paper.authors || []).map((a) => a.name).join(', '),
          Subject: 'IJARST Journal Article',
          Creator: 'IJARST – ijarst.uk',
        },
      });

      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end',  () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = doc.page.width - L - R_MARGIN;   // usable width
      const R = L + W;                            // right edge

      // ── Top accent bar (yellow) ──────────────────────────────────────────
      doc.rect(0, 0, doc.page.width, 5).fill('#F5C400');

      // ── Header row ──────────────────────────────────────────────────────
      const hY = 20;
      doc.fontSize(8).font('Helvetica').fillColor('#666666');
      doc.text(`Volume ${paper.volume}, Issue ${paper.issue}`, L, hY);
      doc.text('ISSN: 2977-4832  |  e-ISSN: 2977-4832', L, hY, { width: W, align: 'right' });

      // Green rule under header
      doc.moveTo(L, hY + 12).lineTo(R, hY + 12).strokeColor('#1B5E20').lineWidth(1).stroke();

      // ── Journal identity block ───────────────────────────────────────────
      doc.fontSize(28).font('Helvetica-Bold').fillColor('#1B5E20');
      doc.text('IJARST', L, hY + 18, { width: W, align: 'center' });

      doc.fontSize(9).font('Helvetica').fillColor('#1B5E20');
      doc.text(
        'International Journal of Applied Research in Science & Technology',
        L, hY + 52, { width: W, align: 'center' }
      );

      doc.fontSize(7.5).font('Helvetica').fillColor('#888888');
      doc.text('JOURNAL ARTICLE  ·  www.ijarst.uk  ·  ijarstjournal@gmail.com', L, hY + 64, {
        width: W, align: 'center',
      });

      // Double green rule
      const ruleY = hY + 78;
      doc.moveTo(L, ruleY).lineTo(R, ruleY).strokeColor('#1B5E20').lineWidth(2).stroke();
      doc.moveTo(L, ruleY + 4).lineTo(R, ruleY + 4).strokeColor('#1B5E20').lineWidth(0.5).stroke();

      // ── Paper title ──────────────────────────────────────────────────────
      const titleY = ruleY + 16;
      doc.fontSize(12.5).font('Helvetica-Bold').fillColor('#0D0D0D');
      doc.text((paper.title || 'Untitled').toUpperCase(), L, titleY, {
        width: W, align: 'center',
      });

      let curY = doc.y + 14;

      // ── Authors ─────────────────────────────────────────────────────────
      doc.moveTo(L, curY).lineTo(R, curY).strokeColor('#DDDDDD').lineWidth(0.5).stroke();
      curY += 10;

      (paper.authors || []).forEach((author, idx) => {
        doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#0D0D0D');
        doc.text(author.name || '', L, curY, { width: W });
        curY = doc.y + 1;

        if (author.affiliation) {
          doc.fontSize(8.5).font('Helvetica').fillColor('#555555');
          doc.text(author.affiliation, L, curY, { width: W });
          curY = doc.y + 1;
        }
        if (author.email) {
          doc.fontSize(8.5).font('Helvetica-Oblique').fillColor('#1a73e8');
          doc.text(author.email, L, curY, { width: W });
          curY = doc.y + 1;
        }
        if (idx < (paper.authors || []).length - 1) curY += 5;
      });

      curY += 12;

      // ── Abstract ────────────────────────────────────────────────────────
      doc.moveTo(L, curY).lineTo(R, curY).strokeColor('#DDDDDD').lineWidth(0.5).stroke();
      curY += 10;

      doc.fontSize(9).font('Helvetica-Bold').fillColor('#1B5E20');
      doc.text('ABSTRACT', L, curY, { width: W });
      curY = doc.y + 4;

      const absStartY = curY;
      doc.fontSize(9).font('Helvetica').fillColor('#0D0D0D');
      doc.text(paper.abstract || '', L + 6, curY, { width: W - 6, align: 'justify' });
      const absEndY = doc.y;

      // Left green border on abstract
      doc.moveTo(L, absStartY - 2).lineTo(L, absEndY)
        .strokeColor('#1B5E20').lineWidth(2.5).stroke();

      curY = absEndY + 10;

      // ── Keywords ────────────────────────────────────────────────────────
      if (paper.keywords && paper.keywords.length > 0) {
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0D0D0D');
        doc.text('Keywords: ', L, curY, { continued: true, width: W });
        doc.font('Helvetica').fillColor('#555555');
        doc.text(paper.keywords.join(' · '), { continued: false });
        curY = doc.y + 14;
      } else {
        curY += 8;
      }

      // ── Metadata grid ────────────────────────────────────────────────────
      doc.moveTo(L, curY).lineTo(R, curY).strokeColor('#1B5E20').lineWidth(1).stroke();
      curY += 8;

      const pubDateStr = paper.publicationDate
        ? new Date(paper.publicationDate).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
          })
        : 'N/A';

      const metaRows = [
        [{ label: 'Journal', value: 'IJARST' }, { label: 'Volume', value: String(paper.volume) }, { label: 'Issue', value: String(paper.issue) }],
        [{ label: 'Published', value: pubDateStr }, { label: 'DOI', value: paper.doi || 'Pending' }, { label: 'Access', value: 'Open Access' }],
        [{ label: 'Pages', value: `${paper.pageStart || 1}–${paper.pageEnd || 1}` }, { label: 'ISSN', value: '2977-4832' }, { label: 'Language', value: 'English' }],
      ];

      const colW = W / 3;
      metaRows.forEach((row) => {
        let colX = L;
        let rowMaxY = curY;
        row.forEach((cell) => {
          doc.fontSize(7).font('Helvetica-Bold').fillColor('#1B5E20');
          doc.text(cell.label.toUpperCase(), colX, curY, { width: colW - 4 });
          const lblBottom = doc.y;
          doc.fontSize(8.5).font('Helvetica').fillColor('#0D0D0D');
          doc.text(cell.value, colX, lblBottom, { width: colW - 4 });
          if (doc.y > rowMaxY) rowMaxY = doc.y;
          colX += colW;
        });
        curY = rowMaxY + 8;
      });

      doc.moveTo(L, curY).lineTo(R, curY).strokeColor('#1B5E20').lineWidth(1).stroke();

      // ── "Full manuscript follows on next page" notice ────────────────────
      curY += 16;
      doc.fontSize(8.5).font('Helvetica-Oblique').fillColor('#888888');
      doc.text('Full manuscript begins on the following page.', L, curY, { width: W, align: 'center' });

      doc.flushPages();
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2+3 — Merge cover + manuscript, then stamp header/footer on every page
// ─────────────────────────────────────────────────────────────────────────────
async function mergeAndStamp(coverBuffer, manuscriptBuffer, paper) {
  // Load both PDFs
  const coverDoc      = await LibPDFDocument.load(coverBuffer);
  const manuscriptDoc = await LibPDFDocument.load(manuscriptBuffer);

  // Create the final merged document
  const finalDoc = await LibPDFDocument.create();

  // Copy cover page(s) then manuscript pages
  const coverPages      = await finalDoc.copyPages(coverDoc, coverDoc.getPageIndices());
  const manuscriptPages = await finalDoc.copyPages(manuscriptDoc, manuscriptDoc.getPageIndices());

  coverPages.forEach((p) => finalDoc.addPage(p));
  manuscriptPages.forEach((p) => finalDoc.addPage(p));

  // Embed fonts once (re-used across all pages)
  const fontRegular = await finalDoc.embedFont(StandardFonts.Helvetica);
  const fontBold    = await finalDoc.embedFont(StandardFonts.HelveticaBold);

  const totalPages = finalDoc.getPageCount();
  const pubYear    = paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : new Date().getFullYear();

  for (let i = 0; i < totalPages; i++) {
    const page = finalDoc.getPage(i);
    const { width, height } = page.getSize();

    const margin = 36;       // 0.5 inch side margin for stamp text
    const textWidth = width - margin * 2;

    // ── HEADER ──────────────────────────────────────────────────────────────
    const headerHeight = 22; // pts from top
    const headerY      = height - headerHeight; // pdf-lib y=0 is bottom-left

    // White background strip so header is always legible over any existing content
    page.drawRectangle({
      x: 0, y: headerY,
      width, height: headerHeight + 2,
      color: C.white,
      opacity: 1,
    });

    // Yellow top bar (3pt tall)
    page.drawRectangle({
      x: 0, y: height - 4,
      width, height: 4,
      color: C.yellow,
    });

    // Green rule under header
    page.drawLine({
      start: { x: margin,    y: headerY },
      end:   { x: width - margin, y: headerY },
      thickness: 0.75,
      color: C.green,
    });

    // Header left: "IJARST  Vol.X, Issue Y"
    const headerLeft = `IJARST  |  Vol. ${paper.volume}, Issue ${paper.issue}`;
    page.drawText(headerLeft, {
      x: margin, y: headerY + 7,
      size: 7, font: fontBold,
      color: C.green,
    });

    // Header right: "ISSN: 2977-4832  |  Open Access"
    const headerRight = 'ISSN: 2977-4832  |  Open Access';
    const headerRightWidth = fontRegular.widthOfTextAtSize(headerRight, 7);
    page.drawText(headerRight, {
      x: width - margin - headerRightWidth,
      y: headerY + 7,
      size: 7, font: fontRegular,
      color: C.lightGray,
    });

    // ── FOOTER ──────────────────────────────────────────────────────────────
    const footerHeight = 20;
    const footerTopY   = footerHeight; // bottom of footer zone

    // White background strip
    page.drawRectangle({
      x: 0, y: 0,
      width, height: footerHeight + 2,
      color: C.white,
      opacity: 1,
    });

    // Gray rule above footer
    page.drawLine({
      start: { x: margin,           y: footerTopY },
      end:   { x: width - margin,   y: footerTopY },
      thickness: 0.5,
      color: C.veryLight,
    });

    // Footer left: www.ijarst.uk
    page.drawText('www.ijarst.uk', {
      x: margin, y: 7,
      size: 7, font: fontRegular,
      color: C.lightGray,
    });

    // Footer center: page number
    const pageLabel = `${i + 1} / ${totalPages}`;
    const pageLabelWidth = fontRegular.widthOfTextAtSize(pageLabel, 7);
    page.drawText(pageLabel, {
      x: (width - pageLabelWidth) / 2, y: 7,
      size: 7, font: fontRegular,
      color: C.lightGray,
    });

    // Footer right: copyright
    const footerRight = `© ${pubYear} IJARST  ·  ISSN: 2977-4832`;
    const footerRightWidth = fontRegular.widthOfTextAtSize(footerRight, 7);
    page.drawText(footerRight, {
      x: width - margin - footerRightWidth, y: 7,
      size: 7, font: fontRegular,
      color: C.lightGray,
    });
  }

  // Save and return as Buffer
  const pdfBytes = await finalDoc.save();
  return Buffer.from(pdfBytes);
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API — called from paperRoutes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates the final reader-facing PDF:
 *   cover page + full manuscript, branded header+footer on every page.
 *
 * @param {Object} paper          - Mongoose Paper document (must have .pdfFile.data)
 * @returns {Promise<Buffer>}     - Final merged+stamped PDF buffer
 */
async function generatePaperPDF(paper) {
  if (!paper.pdfFile || !paper.pdfFile.data) {
    throw new Error('No manuscript PDF uploaded for this paper.');
  }

  const coverBuffer      = await generateCoverPage(paper);
  const manuscriptBuffer = Buffer.isBuffer(paper.pdfFile.data)
    ? paper.pdfFile.data
    : Buffer.from(paper.pdfFile.data);

  return mergeAndStamp(coverBuffer, manuscriptBuffer, paper);
}

module.exports = { generatePaperPDF };
