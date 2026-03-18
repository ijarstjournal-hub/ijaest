const express = require('express');
const Paper = require('../models/Paper');
const auth = require('../middleware/auth');
const { generatePaperPDF } = require('../utils/pdfGenerator');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/papers  — all published papers (optional ?search=)
router.get('/', async (req, res) => {
  try {
    const query = { published: true };
    if (req.query.search) {
      // Escape special regex chars to prevent ReDoS
      const escaped = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped, 'i');
      query.$or = [
        { title: re },
        { abstract: re },
        { keywords: re },
        { 'authors.name': re },
      ];
    }

    const papers = await Paper.find(query)
      .select('-pdfFile.data -generatedPdf')
      .sort({ publicationDate: -1, createdAt: -1 });

    const result = papers.map((p) => {
      const obj = p.toObject();
      obj.hasPdf = !!(p.pdfFile && p.pdfFile.filename);
      delete obj.pdfFile;
      return obj;
    });

    res.json(result);
  } catch (err) {
    console.error('GET /papers error:', err);
    res.status(500).json({ message: 'Error fetching papers.' });
  }
});

// GET /api/papers/total-citations  — sum of all paper citations (public)
router.get('/total-citations', async (req, res) => {
  try {
    const result = await Paper.aggregate([
      { $match: { published: true } },
      { $group: { _id: null, total: { $sum: '$citations' } } },
    ]);
    const total = result.length > 0 ? result[0].total : 0;
    res.json({ total: 200 + total }); // 200 base + real citations
  } catch (err) {
    console.error('GET /total-citations error:', err);
    res.status(500).json({ total: 200 });
  }
});

// GET /api/papers/most-viewed  — single most-viewed published paper
router.get('/most-viewed', async (req, res) => {
  try {
    const paper = await Paper.findOne({ published: true })
      .select('-pdfFile.data -generatedPdf')
      .sort({ views: -1 });

    if (!paper) return res.status(404).json({ message: 'No papers found.' });

    const obj = paper.toObject();
    obj.hasPdf = !!(paper.pdfFile && paper.pdfFile.filename);
    delete obj.pdfFile;
    res.json(obj);
  } catch (err) {
    console.error('GET /most-viewed error:', err);
    res.status(500).json({ message: 'Error fetching most viewed paper.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES  (must come before /:id to avoid route conflict)
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/papers/stats  — public stats (total citations, papers count)
router.get('/stats', async (req, res) => {
  try {
    const result = await Paper.aggregate([
      { $match: { published: true } },
      { $group: {
        _id: null,
        totalCitations: { $sum: '$citations' },
        totalPapers: { $sum: 1 },
        totalDownloads: { $sum: '$downloads' },
      }}
    ]);
    const stats = result[0] || { totalCitations: 0, totalPapers: 0, totalDownloads: 0 };
    res.json({
      citations: 200 + stats.totalCitations,   // 200 base + real citations
      papers: stats.totalPapers,
      downloads: stats.totalDownloads,
    });
  } catch (err) {
    console.error('GET /stats error:', err);
    res.status(500).json({ message: 'Error fetching stats.' });
  }
});
router.get('/admin/all', auth, async (req, res) => {
  try {
    // Load pdfFile but only the size/filename metadata — not the actual buffer
    const papers = await Paper.find({})
      .select('-pdfFile.data -generatedPdf')
      .sort({ createdAt: -1 });

    // Add hasPdf flag to each paper
    const result = papers.map((p) => {
      const obj = p.toObject();
      obj.hasPdf = !!(p.pdfFile && p.pdfFile.filename);
      delete obj.pdfFile;
      return obj;
    });

    res.json(result);
  } catch (err) {
    console.error('GET /admin/all error:', err);
    res.status(500).json({ message: 'Error fetching papers.' });
  }
});

// POST /api/papers/admin/create  — create paper with base64 PDF (auth)
router.post('/admin/create', auth, async (req, res) => {
  try {
    const {
      title,
      abstract,
      authors,
      keywords,
      volume,
      issue,
      publicationDate,
      doi,
      pageStart,
      pageEnd,
      pdfBase64,
      pdfFilename,
      publishNow,
    } = req.body;

    if (!title || !abstract || !volume || !issue) {
      return res.status(400).json({ message: 'Title, abstract, volume, and issue are required.' });
    }

    const paperData = {
      title: title.trim(),
      abstract: abstract.trim(),
      authors: Array.isArray(authors) ? authors : [],
      keywords: Array.isArray(keywords) ? keywords.filter(Boolean) : [],
      volume: Number(volume),
      issue: Number(issue),
      publicationDate: publicationDate ? new Date(publicationDate) : null,
      pageStart: pageStart ? Number(pageStart) : 1,
      pageEnd: pageEnd ? Number(pageEnd) : 1,
    };

    if (doi && doi.trim()) paperData.doi = doi.trim();

    // Store uploaded PDF as Buffer
    if (pdfBase64) {
      const buffer = Buffer.from(pdfBase64, 'base64');
      paperData.pdfFile = {
        data: buffer,
        filename: pdfFilename || 'manuscript.pdf',
        uploadedAt: new Date(),
        size: buffer.length,
      };
    }

    const paper = new Paper(paperData);
    await paper.save();

    // Optionally publish immediately
    if (publishNow) {
      paper.published = true;
      paper.publicationDate = paper.publicationDate || new Date();
      const pdfBuffer = await generatePaperPDF(paper);
      paper.generatedPdf = {
        data: pdfBuffer,
        filename: `ijarst_v${paper.volume}i${paper.issue}_${paper._id}.pdf`,
        size: pdfBuffer.length,
        generatedAt: new Date(),
      };
      await paper.save();
    }

    const result = paper.toObject();
    delete result.pdfFile;
    delete result.generatedPdf;

    res.status(201).json({ message: 'Paper created successfully.', paper: result });
  } catch (err) {
    console.error('POST /admin/create error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A paper with this DOI already exists.' });
    }
    res.status(500).json({ message: 'Error creating paper.' });
  }
});

// PUT /api/papers/admin/:id  — update paper (auth, PDF optional)
router.put('/admin/:id', auth, async (req, res) => {
  try {
    const {
      title,
      abstract,
      authors,
      keywords,
      volume,
      issue,
      publicationDate,
      doi,
      pageStart,
      pageEnd,
      pdfBase64,
      pdfFilename,
    } = req.body;

    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found.' });

    if (title !== undefined) paper.title = title.trim();
    if (abstract !== undefined) paper.abstract = abstract.trim();
    if (authors !== undefined) paper.authors = Array.isArray(authors) ? authors : [];
    if (keywords !== undefined) paper.keywords = Array.isArray(keywords) ? keywords.filter(Boolean) : [];
    if (volume !== undefined) paper.volume = Number(volume);
    if (issue !== undefined) paper.issue = Number(issue);
    if (publicationDate !== undefined) paper.publicationDate = publicationDate ? new Date(publicationDate) : null;
    if (doi !== undefined && doi.trim()) paper.doi = doi.trim();
    if (pageStart !== undefined) paper.pageStart = Number(pageStart);
    if (pageEnd !== undefined) paper.pageEnd = Number(pageEnd);

    // Replace PDF only if new one provided
    if (pdfBase64) {
      const buffer = Buffer.from(pdfBase64, 'base64');
      paper.pdfFile = {
        data: buffer,
        filename: pdfFilename || 'manuscript.pdf',
        uploadedAt: new Date(),
        size: buffer.length,
      };
      // Invalidate generated PDF so it gets regenerated on next publish
      paper.generatedPdf = null;
    }

    await paper.save();

    const result = paper.toObject();
    delete result.pdfFile;
    delete result.generatedPdf;

    res.json({ message: 'Paper updated successfully.', paper: result });
  } catch (err) {
    console.error('PUT /admin/:id error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A paper with this DOI already exists.' });
    }
    res.status(500).json({ message: 'Error updating paper.' });
  }
});

// PATCH /api/papers/admin/:id/citations  — set citation count for a paper (auth)
router.patch('/admin/:id/citations', auth, async (req, res) => {
  try {
    const { citations } = req.body;
    if (citations === undefined || isNaN(Number(citations)) || Number(citations) < 0) {
      return res.status(400).json({ message: 'Valid citations count required.' });
    }
    const paper = await Paper.findByIdAndUpdate(
      req.params.id,
      { citations: Number(citations) },
      { new: true }
    ).select('-pdfFile -generatedPdf');
    if (!paper) return res.status(404).json({ message: 'Paper not found.' });
    res.json({ message: 'Citations updated.', citations: paper.citations });
  } catch (err) {
    console.error('PATCH /admin/:id/citations error:', err);
    res.status(500).json({ message: 'Error updating citations.' });
  }
});

// DELETE /api/papers/admin/:id  — delete paper (auth)
router.delete('/admin/:id', auth, async (req, res) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found.' });
    res.json({ message: 'Paper deleted successfully.' });
  } catch (err) {
    console.error('DELETE /admin/:id error:', err);
    res.status(500).json({ message: 'Error deleting paper.' });
  }
});

// On publish: generates branded PDF (cover + manuscript + header/footer stamps).
// Blocks publishing if no manuscript PDF has been uploaded yet.
router.patch('/admin/:id/publish', auth, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found.' });

    // Cannot publish without an uploaded manuscript PDF
    if (!paper.published && (!paper.pdfFile || !paper.pdfFile.data)) {
      return res.status(400).json({
        message: 'Cannot publish: no PDF has been uploaded for this paper. Please edit the paper and upload the manuscript PDF first.',
      });
    }

    paper.published = !paper.published;

    if (paper.published) {
      // Set publication date if not already set
      if (!paper.publicationDate) paper.publicationDate = new Date();

      // Generate branded PDF: cover page + full manuscript + header/footer on every page
      try {
        const pdfBuffer = await generatePaperPDF(paper);
        paper.generatedPdf = {
          data: pdfBuffer,
          filename: `ijarst_v${paper.volume}i${paper.issue}_${paper._id}.pdf`,
          size: pdfBuffer.length,
          generatedAt: new Date(),
        };
      } catch (pdfErr) {
        console.error('PDF generation error:', pdfErr);
        // Don't block publish if PDF stamping fails — log it and serve raw manuscript as fallback
        paper.generatedPdf = null;
      }
    }

    await paper.save();

    const result = paper.toObject();
    delete result.pdfFile;
    delete result.generatedPdf;
    result.hasPdf = true;

    res.json({
      message: `Paper ${paper.published ? 'published' : 'unpublished'} successfully.`,
      paper: result,
    });
  } catch (err) {
    console.error('PATCH /admin/:id/publish error:', err);
    res.status(500).json({ message: 'Error toggling publish status.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC DYNAMIC ROUTES  (must come AFTER /admin/... routes)
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/papers/:id  — single published paper (increments views)
router.get('/:id', async (req, res) => {
  try {
    const paper = await Paper.findOneAndUpdate(
      { _id: req.params.id, published: true },
      { $inc: { views: 1 } },
      { new: true }
    ).select('-pdfFile.data -generatedPdf.data');

    if (!paper) return res.status(404).json({ message: 'Paper not found.' });

    const paperObj = paper.toObject();
    // hasPdf: true if a branded PDF (or at minimum an uploaded PDF) exists
    paperObj.hasPdf = !!(
      (paper.generatedPdf && paper.generatedPdf.size) ||
      (paper.pdfFile && paper.pdfFile.filename)
    );
    delete paperObj.pdfFile;
    delete paperObj.generatedPdf;

    res.json(paperObj);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Paper not found.' });
    }
    console.error('GET /:id error:', err);
    res.status(500).json({ message: 'Error fetching paper.' });
  }
});

// GET /api/papers/:id/pdf  — serve the branded PDF (cover + manuscript + stamps)
// Falls back to raw uploaded manuscript if branding generation failed.
router.get('/:id/pdf', async (req, res) => {
  try {
    const paper = await Paper.findOne({ _id: req.params.id, published: true }).select(
      'generatedPdf pdfFile title volume issue doi downloads'
    );

    if (!paper) return res.status(404).json({ message: 'Paper not found.' });

    // Prefer the branded generated PDF; fall back to raw upload if stamping failed
    const pdfData = (paper.generatedPdf && paper.generatedPdf.data)
      ? paper.generatedPdf.data
      : (paper.pdfFile && paper.pdfFile.data)
        ? paper.pdfFile.data
        : null;

    if (!pdfData) {
      return res.status(404).json({ message: 'PDF not available for this paper.' });
    }

    // Increment downloads counter
    await Paper.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });

    // Build a clean filename
    const safeTitle = (paper.title || 'paper')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .slice(0, 60);
    const filename = `ijarst_v${paper.volume}i${paper.issue}_${safeTitle}.pdf`;

    // inline = browser PDF viewer; ?download=1 = force save
    const disposition = req.query.download === '1' ? 'attachment' : 'inline';

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename="${filename}"`,
      'Content-Length': pdfData.length,
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    });

    res.send(pdfData);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Paper not found.' });
    }
    console.error('GET /:id/pdf error:', err);
    res.status(500).json({ message: 'Error fetching PDF.' });
  }
});

module.exports = router;
