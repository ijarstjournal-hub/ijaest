import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Issues from './pages/Issues';
import SinglePaper from './pages/SinglePaper';
import Submit from './pages/Submit';
import Fees from './pages/Fees';
import Indexing from './pages/Indexing';
import EditorialBoard from './pages/EditorialBoard';
import AimsScope from './pages/AimsScope';
import OpenAccessPolicy from './pages/OpenAccessPolicy';
import PeerReviewPolicy from './pages/PeerReviewPolicy';
import PlagiarismPolicy from './pages/PlagiarismPolicy';
import AuthorsGuide from './pages/AuthorsGuide';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Layout wrapper for public pages (with Navbar + Footer)
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/issues" element={<PublicLayout><Issues /></PublicLayout>} />
          <Route path="/papers/:id" element={<PublicLayout><SinglePaper /></PublicLayout>} />
          <Route path="/submit" element={<PublicLayout><Submit /></PublicLayout>} />
          <Route path="/fees" element={<PublicLayout><Fees /></PublicLayout>} />
          <Route path="/indexing" element={<PublicLayout><Indexing /></PublicLayout>} />
          <Route path="/editorial-board" element={<PublicLayout><EditorialBoard /></PublicLayout>} />
          <Route path="/aims-scope" element={<PublicLayout><AimsScope /></PublicLayout>} />
          <Route path="/open-access-policy" element={<PublicLayout><OpenAccessPolicy /></PublicLayout>} />
          <Route path="/peer-review-policy" element={<PublicLayout><PeerReviewPolicy /></PublicLayout>} />
          <Route path="/plagiarism-policy" element={<PublicLayout><PlagiarismPolicy /></PublicLayout>} />
          <Route path="/authors-guide" element={<PublicLayout><AuthorsGuide /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin – no public layout */}
          <Route path="/x7k-admin/login" element={<AdminLogin />} />
          <Route
            path="/x7k-admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 72, color: 'var(--green)', marginBottom: 16 }}>404</h1>
                  <p style={{ fontSize: 20, color: 'var(--gray-700)', marginBottom: 32 }}>Page not found.</p>
                  <a href="/" className="btn btn-primary">Return Home</a>
                </div>
              </PublicLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
