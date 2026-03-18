const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    affiliation: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
  },
  { _id: false }
);

const pdfFileSchema = new mongoose.Schema(
  {
    data: { type: Buffer },
    filename: { type: String },
    uploadedAt: { type: Date },
    size: { type: Number },
  },
  { _id: false }
);

const generatedPdfSchema = new mongoose.Schema(
  {
    data: { type: Buffer },
    filename: { type: String },
    size: { type: Number },
    generatedAt: { type: Date },
  },
  { _id: false }
);

const paperSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    abstract: { type: String, required: [true, 'Abstract is required'], trim: true },
    authors: { type: [authorSchema], default: [] },
    keywords: { type: [String], default: [] },
    pdfFile: { type: pdfFileSchema, default: null },
    doi: { type: String, unique: true, sparse: true, trim: true },
    volume: { type: Number, required: [true, 'Volume is required'], min: 1 },
    issue: { type: Number, required: [true, 'Issue is required'], min: 1 },
    publicationDate: { type: Date, default: null },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0, min: 0 },
    downloads: { type: Number, default: 0, min: 0 },
    citations: { type: Number, default: 0, min: 0 },
    generatedPdf: { type: generatedPdfSchema, default: null },
    pageStart: { type: Number, default: 1 },
    pageEnd: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

// Auto-generate DOI before first save if not provided
paperSchema.pre('save', function (next) {
  if (!this.doi) {
    const last6 = this._id.toString().slice(-6);
    this.doi = `10.5678/ijarst.v${this.volume}i${this.issue}.${last6}`;
  }
  next();
});

// Index for fast lookups
paperSchema.index({ published: 1, createdAt: -1 });
paperSchema.index({ volume: 1, issue: 1 });
paperSchema.index({ doi: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Paper', paperSchema);
