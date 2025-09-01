import mongoose from 'mongoose';

// MongoDB connection
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
  }
}

// Schemas
const PostSchema = new mongoose.Schema({
  title: {
    tr: String,
    en: String
  },
  excerpt: {
    tr: String,
    en: String
  },
  content: {
    tr: String,
    en: String
  },
  slug: {
    tr: String,
    en: String
  },
  featured_image: String,
  category_id: String,
  tags: {
    tr: [String],
    en: [String]
  },
  is_featured: { type: Boolean, default: false },
  status: { type: String, default: 'published' },
  publishedAt: { type: Date, default: Date.now },
  view_count: { type: Number, default: 0 },
  like_count: { type: Number, default: 0 },
  read_time: { type: Number, default: 5 }
});

const CategorySchema = new mongoose.Schema({
  name: {
    tr: String,
    en: String
  },
  slug: {
    tr: String,
    en: String
  },
  color: String,
  icon: String,
  order_index: Number,
  is_active: { type: Boolean, default: true }
});

const PackageSchema = new mongoose.Schema({
  name: {
    tr: String,
    en: String
  },
  description: {
    tr: String,
    en: String
  },
  price: Number,
  originalPrice: Number,
  duration: String,
  features: {
    tr: [String],
    en: [String]
  },
  featured: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  category: String,
  icon: String,
  color: String
});

const TestimonialSchema = new mongoose.Schema({
  name: String,
  title: {
    tr: String,
    en: String
  },
  content: {
    tr: String,
    en: String
  },
  rating: Number,
  avatar: String,
  status: { type: String, default: 'approved' },
  createdAt: { type: Date, default: Date.now }
});

const FAQSchema = new mongoose.Schema({
  question: {
    tr: String,
    en: String
  },
  answer: {
    tr: String,
    en: String
  },
  category: String,
  order_index: Number,
  is_active: { type: Boolean, default: true }
});

// Models
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-requested-with',
  'Access-Control-Max-Age': '86400'
};

export default async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`🚀 API Request: ${req.method} ${req.url}`);

  try {
    // Connect to MongoDB
    await connectToDatabase();

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    switch (pathname) {
      case '/api/health':
        return res.status(200).json({
          success: true,
          message: 'API is working',
          timestamp: new Date().toISOString()
        });

      case '/api/blog':
        return await handleBlog(req, res);

      case '/api/categories':
        return await handleCategories(req, res);

      case '/api/packages':
        return await handlePackages(req, res);

      case '/api/testimonials':
        return await handleTestimonials(req, res);

      case '/api/faq':
        return await handleFAQ(req, res);

      default:
        return res.status(404).json({ 
          success: false, 
          error: 'Endpoint not found' 
        });
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
}

// Blog Handler
async function handleBlog(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { type, limit } = req.query;
    
    let query = { status: 'published' };
    if (type === 'featured') {
      query.is_featured = true;
    }

    let mongoQuery = Post.find(query).sort({ publishedAt: -1 });
    
    if (limit && !isNaN(parseInt(limit))) {
      mongoQuery = mongoQuery.limit(parseInt(limit));
    }

    const posts = await mongoQuery;

    const transformedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      featured_image: post.featured_image,
      category_id: post.category_id,
      tags: post.tags,
      is_featured: post.is_featured,
      status: post.status,
      view_count: post.view_count,
      like_count: post.like_count,
      read_time: post.read_time,
      publishedAt: post.publishedAt
    }));

    return res.status(200).json({
      success: true,
      data: transformedPosts
    });
  } catch (error) {
    console.error('Blog error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// Categories Handler
async function handleCategories(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const categories = await Category.find({ is_active: true })
      .sort({ order_index: 1 });

    const transformedCategories = categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      color: cat.color,
      icon: cat.icon,
      order_index: cat.order_index,
      is_active: cat.is_active
    }));

    return res.status(200).json({
      success: true,
      data: transformedCategories
    });
  } catch (error) {
    console.error('Categories error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// Packages Handler
async function handlePackages(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { type } = req.query;
    
    let query = {};
    if (type === 'featured' || type === 'home-featured') {
      query.featured = true;
    }
    if (type === 'popular') {
      query.popular = true;
    }

    const packages = await Package.find(query);

    const transformedPackages = packages.map(pkg => ({
      _id: pkg._id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      duration: pkg.duration,
      features: pkg.features,
      featured: pkg.featured,
      popular: pkg.popular,
      category: pkg.category,
      icon: pkg.icon,
      color: pkg.color
    }));

    return res.status(200).json({
      success: true,
      data: transformedPackages
    });
  } catch (error) {
    console.error('Packages error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// Testimonials Handler
async function handleTestimonials(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { type = 'approved', limit } = req.query;
    
    let query = { status: type };
    
    let mongoQuery = Testimonial.find(query).sort({ createdAt: -1 });
    
    if (limit && !isNaN(parseInt(limit))) {
      mongoQuery = mongoQuery.limit(parseInt(limit));
    }

    const testimonials = await mongoQuery;

    const transformedTestimonials = testimonials.map(test => ({
      _id: test._id,
      name: test.name,
      title: test.title,
      content: test.content,
      rating: test.rating,
      avatar: test.avatar,
      status: test.status,
      createdAt: test.createdAt
    }));

    return res.status(200).json({
      success: true,
      data: transformedTestimonials
    });
  } catch (error) {
    console.error('Testimonials error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// FAQ Handler
async function handleFAQ(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { category } = req.query;
    
    let query = { is_active: true };
    if (category) {
      query.category = category;
    }

    const faqs = await FAQ.find(query).sort({ order_index: 1 });

    const transformedFAQs = faqs.map(faq => ({
      _id: faq._id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order_index: faq.order_index,
      is_active: faq.is_active
    }));

    return res.status(200).json({
      success: true,
      data: transformedFAQs
    });
  } catch (error) {
    console.error('FAQ error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
