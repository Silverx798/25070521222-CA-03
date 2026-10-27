const express = require('express');
const router = express.Router();
const {
  getPendingSubmissions,
  updateSubmissionStatus,
  getReports,
  updateReportStatus,
  getAssetDiagnostics
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin or moderator role
router.use(authenticate);
router.use(authorize('admin', 'moderator'));

router.get('/submissions', getPendingSubmissions);
router.patch('/submissions/:id', updateSubmissionStatus);
router.get('/reports', getReports);
router.patch('/reports/:id', updateReportStatus);
router.get('/diagnostics', getAssetDiagnostics);

module.exports = router;

