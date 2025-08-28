import express from 'express';
import { blog } from '../src/lib/mongoClient.js';

const router = express.Router();

// Get all posts (Admin)
router.get('/', async (req, res) => {
  try {
    const { language = 'tr', limit, categories, status } = req.query;
    
    let data;
    if (status === 'all' || !status) {
      data = await blog.getAllPosts(language, limit ? parseInt(limit) : null, categories);
    } else {
      data = await blog.getPosts(language, limit ? parseInt(limit) : null, categories);
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Blog posts fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get published posts (Public)
router.get('/published', async (req, res) => {
  try {
    const { language = 'tr', limit, categories } = req.query;
    const data = await blog.getPosts(language, limit ? parseInt(limit) : null, categories);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Published blog posts fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get featured posts
router.get('/featured', async (req, res) => {
  try {
    const { language = 'tr', limit = 3 } = req.query;
    const data = await blog.getFeatured(language, parseInt(limit));

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Featured blog posts fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const data = await blog.getCategories();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Blog categories fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single post by slug
router.get('/post/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { language = 'tr' } = req.query;
    
    const data = await blog.getBySlug(slug, language);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Blog post fetch error:', error.message);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// Create new post (Admin)
router.post('/', async (req, res) => {
  try {
    const postData = req.body;

    if (!postData.title_tr || !postData.title_en) {
      return res.status(400).json({
        success: false,
        message: 'Başlık gerekli (hem Türkçe hem İngilizce)'
      });
    }

    const data = await blog.create(postData);

    res.status(201).json({
      success: true,
      message: 'Blog yazısı başarıyla oluşturuldu',
      data
    });
  } catch (error) {
    console.error('❌ Blog post creation error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update post (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const data = await blog.update(id, updateData);

    res.json({
      success: true,
      message: 'Blog yazısı başarıyla güncellendi',
      data
    });
  } catch (error) {
    console.error('❌ Blog post update error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete post (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await blog.delete(id);

    res.json({
      success: true,
      message: 'Blog yazısı başarıyla silindi'
    });
  } catch (error) {
    console.error('❌ Blog post deletion error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Increment post view count
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = await blog.incrementView(id);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ View increment error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get related posts
router.get('/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'tr' } = req.query;
    
    const data = await blog.getRelatedPosts(id, language);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Related posts error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Like/unlike post
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = await blog.toggleLike(id);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Like error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single post by ID (Admin) - Keep at end to avoid conflicts
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = await blog.getById(id);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Blog post fetch error:', error.message);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

export default router;