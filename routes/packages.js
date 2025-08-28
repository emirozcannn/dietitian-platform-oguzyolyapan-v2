import express from 'express';
import { packages } from '../src/lib/mongoClient.js';

const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
  try {
    const { language = 'tr' } = req.query;
    const data = await packages.getAll(language);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Packages fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get popular packages
router.get('/popular', async (req, res) => {
  try {
    const { language = 'tr' } = req.query;
    const data = await packages.getPopular(language);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Popular packages fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
