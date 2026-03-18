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
      const re = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: re },
        { abstract: re },
        { keywords: re },
        { 'authors.name': re },
      ];
    }

    const papers = await Paper.find(query)
      .select('-pdfFile -generatedPdf')
      .sort({ publicationDate: -1, createdAt: -1 });

    res.json(papers);
  } catch (err) {
    console.error('GET /papers error:', err);
    res.status(500).json({ message: 'Error fetching papers.' });
  }
});

// GET /api/papers/most-viewed  — single most-viewed published paper
router.get('/most-viewed', async (req, res) => {
  try {
    const paper = await Paper.findOne({ published: true })
      .select('-pdfFile -generatedPdf')
      .sort({ views: -1 });

    if (!paper) return res.status(404).json({ message: 'No papers found.' });
    res.json(paper);
  } catch (err) {
    console.error('GET /most-viewed error:', err);
    res.status(500).json({ message: 'Error fetching most viewed paper.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES  (must come before /:id to avoid route conflict)
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/papers/admin/all  — all papers including drafts (auth)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const papers = await Paper.find({})
      .select('-pdfFile -generatedPdf')
      .sort({ createdAt: -1 });

    res.json(papers);
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

// PATCH /api/papers/admin/:id/publish  — toggle publish, generate PDF on publish (auth)
router.patch('/admin/:id/publish', auth, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found.' });

    paper.published = !paper.published;

    if (paper.published) {
      // Set publication date if not already set
      if (!paper.publicationDate) paper.publicationDate = new Date();

      // Generate formatted journal PDF
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
        // Don't block publish if PDF generation fails
        paper.generatedPdf = null;
      }
    }

    await paper.save();

    const result = paper.toObject();
    delete result.pdfFile;
    delete result.generatedPdf;

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
    ).select('-pdfFile -generatedPdf');

    if (!paper) return res.status(404).json({ message: 'Paper not found.' });
    res.json(paper);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Paper not found.' });
    }
    console.error('GET /:id error:', err);
    res.status(500).json({ message: 'Error fetching paper.' });
  }
});

// GET /api/papers/:id/pdf  — stream generated PDF (increments downloads)
router.get('/:id/pdf', async (req, res) => {
  try {
    const paper = await Paper.findOne({ _id: req.params.id, published: true }).select(
      'generatedPdf title volume issue doi downloads'
    );

    if (!paper) return res.status(404).json({ message: 'Paper not found.' });

    if (!paper.generatedPdf || !paper.generatedPdf.data) {
      return res.status(404).json({ message: 'PDF not available for this paper.' });
    }

    // Increment downloads
    await Paper.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });

    const filename = paper.generatedPdf.filename || `ijarst_${paper._id}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': paper.generatedPdf.data.length,
      'Cache-Control': 'public, max-age=3600',
    });

    res.send(paper.generatedPdf.data);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Paper not found.' });
    }
    console.error('GET /:id/pdf error:', err);
    res.status(500).json({ message: 'Error fetching PDF.' });
  }
});

module.exports = router;
