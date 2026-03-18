const PDFDocument = require('pdfkit');

const GREEN = '#1B5E20';
const DARK = '#0D0D0D';
const GRAY = '#555555';
const LIGHT_GRAY = '#888888';
const BLUE = '#1a73e8';

/**
 * Generates a formatted IJARST journal PDF for a paper.
 * @param {Object} paper - Mongoose Paper document
 * @returns {Promise<Buffer>} - PDF buffer
 */
function generatePaperPDF(paper) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 55,
        size: 'A4',
        bufferPages: true,
        info: {
          Title: paper.title,
          Author: paper.authors.map((a) => a.name).join(', '),
          Subject: 'IJARST Journal Article',
          Creator: 'IJARST – International Journal of Applied Research in Science & Technology',
        },
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const L = 55; // left margin
      const R = doc.page.width - 55; // right edge
      const W = R - L; // usable width

      // ── HEADER ──────────────────────────────────────────────────────────────
      const headerY = 45;

      // Volume / Issue — left
      doc.fontSize(8.5).font('Helvetica').fillColor(GRAY);
      doc.text(`Volume ${paper.volume}, Issue ${paper.issue}`, L, headerY);

      // ISSN — right
      doc.fontSize(8.5).font('Helvetica').fillColor(GRAY);
      doc.text('ISSN: XXXX-XXXX  |  e-ISSN: XXXX-XXXX', L, headerY, {
        width: W,
        align: 'right',
      });

      // Top green rule
      doc.moveTo(L, headerY + 14).lineTo(R, headerY + 14).strokeColor(GREEN).lineWidth(1.5).stroke();

      // ── JOURNAL IDENTITY ────────────────────────────────────────────────────
      doc.fontSize(30).font('Helvetica-Bold').fillColor(GREEN);
      doc.text('IJARST', L, headerY + 22, { width: W, align: 'center' });

      doc.fontSize(9.5).font('Helvetica').fillColor(GREEN);
      doc.text(
        'International Journal of Applied Research in Science & Technology',
        L,
        headerY + 60,
        { width: W, align: 'center' }
      );

      doc.fontSize(7.5).font('Helvetica').fillColor(LIGHT_GRAY);
      doc.text('JOURNAL ARTICLE  ·  www.ijarst.uk  ·  ijarstjournal@gmail.com', L, headerY + 76, {
        width: W,
        align: 'center',
      });

      // Double green rule
      const ruleY = headerY + 92;
      doc.moveTo(L, ruleY).lineTo(R, ruleY).strokeColor(GREEN).lineWidth(2).stroke();
      doc.moveTo(L, ruleY + 4).lineTo(R, ruleY + 4).strokeColor(GREEN).lineWidth(0.5).stroke();

      // ── TITLE ───────────────────────────────────────────────────────────────
      const titleY = ruleY + 18;
      doc.fontSize(13).font('Helvetica-Bold').fillColor(DARK);
      doc.text(paper.title.toUpperCase(), L, titleY, { width: W, align: 'center' });

      let curY = doc.y + 14;

      // ── AUTHORS ─────────────────────────────────────────────────────────────
      doc.moveTo(L, curY).lineTo(R, curY).strokeColor('#CCCCCC').lineWidth(0.5).stroke();
      curY += 10;

      if (paper.authors && paper.authors.length > 0) {
        paper.authors.forEach((author, idx) => {
          // Name
          doc.fontSize(9.5).font('Helvetica-Bold').fillColor(DARK);
          doc.text(author.name, L, curY, { width: W });
          curY = doc.y + 1;

          // Affiliation
          if (author.affiliation) {
            doc.fontSize(8.5).font('Helvetica').fillColor(GRAY);
            doc.text(author.affiliation, L, curY, { width: W });
            curY = doc.y + 1;
          }

          // Email
          if (author.email) {
            doc.fontSize(8.5).font('Helvetica-Oblique').fillColor(BLUE);
            doc.text(author.email, L, curY, { width: W });
            curY = doc.y + 1;
          }

          if (idx < paper.authors.length - 1) curY += 5;
        });
      }

      curY += 12;

      // ── ABSTRACT ────────────────────────────────────────────────────────────
      doc.moveTo(L, curY).lineTo(R, curY).strokeColor('#CCCCCC').lineWidth(0.5).stroke();
      curY += 10;

      // Green left border for abstract
      const abstractLabelY = curY;
      doc.fontSize(9).font('Helvetica-Bold').fillColor(GREEN);
      doc.text('ABSTRACT', L, abstractLabelY, { width: W });
      curY = doc.y + 4;

      const abstractStartY = curY;
      doc.fontSize(9).font('Helvetica').fillColor(DARK);
      doc.text(paper.abstract, L + 2, curY, { width: W - 2, align: 'justify' });
      const abstractEndY = doc.y;

      // Draw left green border beside abstract text
      doc.moveTo(L - 1, abstractStartY - 2)
        .lineTo(L - 1, abstractEndY)
        .strokeColor(GREEN)
        .lineWidth(2)
        .stroke();

      curY = abstractEndY + 10;

      // ── KEYWORDS ────────────────────────────────────────────────────────────
      if (paper.keywords && paper.keywords.length > 0) {
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor(DARK);
        doc.text('Keywords: ', L, curY, { continued: true, width: W });
        doc.font('Helvetica').fillColor(GRAY);
        doc.text(paper.keywords.join(' · '), { continued: false });
        curY = doc.y + 14;
      } else {
        curY += 8;
      }

      // ── METADATA BOX ────────────────────────────────────────────────────────
      doc.moveTo(L, curY).lineTo(R, curY).strokeColor(GREEN).lineWidth(1).stroke();
      curY += 6;

      const pubDateStr = paper.publicationDate
        ? new Date(paper.publicationDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : 'N/A';

      const metaRows = [
        [
          { label: 'Journal', value: 'IJARST' },
          { label: 'Volume', value: String(paper.volume) },
          { label: 'Issue', value: String(paper.issue) },
        ],
        [
          { label: 'Published', value: pubDateStr },
          { label: 'DOI', value: paper.doi || 'Pending' },
          { label: 'Access', value: 'Open Access' },
        ],
        [
          { label: 'Pages', value: `${paper.pageStart}–${paper.pageEnd}` },
          { label: 'ISSN', value: 'XXXX-XXXX' },
          { label: 'Language', value: 'English' },
        ],
      ];

      const colW = W / 3;

      metaRows.forEach((row) => {
        let colX = L;
        let rowMaxY = curY;
        row.forEach((cell) => {
          doc.fontSize(7.5).font('Helvetica-Bold').fillColor(GREEN);
          doc.text(cell.label.toUpperCase(), colX, curY, { width: colW - 4 });
          const labelBottom = doc.y;
          doc.fontSize(8.5).font('Helvetica').fillColor(DARK);
          doc.text(cell.value, colX, labelBottom, { width: colW - 4 });
          if (doc.y > rowMaxY) rowMaxY = doc.y;
          colX += colW;
        });
        curY = rowMaxY + 8;
      });

      doc.moveTo(L, curY).lineTo(R, curY).strokeColor(GREEN).lineWidth(1).stroke();

      // ── FOOTER ON EVERY PAGE ────────────────────────────────────────────────
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(range.start + i);

        const fY = doc.page.height - 42;
        doc
          .moveTo(L, fY - 4)
          .lineTo(R, fY - 4)
          .strokeColor('#CCCCCC')
          .lineWidth(0.5)
          .stroke();

        doc.fontSize(7.5).font('Helvetica').fillColor(LIGHT_GRAY);
        doc.text('www.ijarst.uk', L, fY, { width: W / 2 });
        doc.text(`© ${new Date().getFullYear()} IJARST  ·  ISSN: XXXX-XXXX  ·  Open Access`, L, fY, {
          width: W,
          align: 'right',
        });

        // Page number
        doc.text(`${i + 1} / ${range.count}`, L, fY + 10, { width: W, align: 'center' });
      }

      doc.flushPages();
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePaperPDF };
