import mongoose from 'mongoose';

// MongoDB connection
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    // Ensure proper MongoDB connection string
    const connectionString = process.env.MONGODB_URI.includes('?') 
      ? `${process.env.MONGODB_URI}&retryWrites=true&w=majority`
      : `${process.env.MONGODB_URI}?retryWrites=true&w=majority`;
      
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
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

// About Page Schema
const AboutSchema = new mongoose.Schema({
  personal_info: {
    name: String,
    title: {
      tr: String,
      en: String
    },
    bio: {
      tr: String,
      en: String
    },
    profile_image: String,
    experience_years: Number,
    specializations: {
      tr: [String],
      en: [String]
    }
  },
  education: [{
    degree: {
      tr: String,
      en: String
    },
    school: String,
    year: String,
    description: {
      tr: String,
      en: String
    }
  }],
  certifications: [{
    name: {
      tr: String,
      en: String
    },
    issuer: String,
    year: String,
    credential_id: String
  }],
  achievements: [{
    title: {
      tr: String,
      en: String
    },
    description: {
      tr: String,
      en: String
    },
    date: String,
    image: String
  }],
  philosophy: {
    tr: String,
    en: String
  },
  approach: {
    tr: String,
    en: String
  },
  is_active: { type: Boolean, default: true },
  last_updated: { type: Date, default: Date.now }
});

// Contact Info Schema
const ContactSchema = new mongoose.Schema({
  office_info: {
    name: {
      tr: String,
      en: String
    },
    address: {
      tr: String,
      en: String
    },
    city: String,
    postal_code: String,
    country: {
      tr: String,
      en: String
    }
  },
  contact_details: {
    phone: String,
    whatsapp: String,
    email: String,
    website: String
  },
  social_media: {
    instagram: String,
    linkedin: String,
    facebook: String,
    youtube: String,
    twitter: String
  },
  office_hours: [{
    day: {
      tr: String,
      en: String
    },
    hours: {
      tr: String,
      en: String
    },
    is_open: Boolean
  }],
  map_coordinates: {
    latitude: Number,
    longitude: Number
  },
  is_active: { type: Boolean, default: true },
  last_updated: { type: Date, default: Date.now }
});

// Home Page Content Schema
const HomeContentSchema = new mongoose.Schema({
  hero_section: {
    title: {
      tr: String,
      en: String
    },
    subtitle: {
      tr: String,
      en: String
    },
    description: {
      tr: String,
      en: String
    },
    cta_button: {
      tr: String,
      en: String
    },
    background_image: String,
    profile_image: String
  },
  stats: [{
    label: {
      tr: String,
      en: String
    },
    value: String,
    icon: String
  }],
  features: [{
    title: {
      tr: String,
      en: String
    },
    description: {
      tr: String,
      en: String
    },
    icon: String,
    color: String
  }],
  is_active: { type: Boolean, default: true },
  last_updated: { type: Date, default: Date.now }
});

// Models
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);
const About = mongoose.models.About || mongoose.model('About', AboutSchema);
const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
const HomeContent = mongoose.models.HomeContent || mongoose.model('HomeContent', HomeContentSchema);

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
    // Connect to MongoDB (optional)
    let isMongoConnected = false;
    try {
      if (process.env.MONGODB_URI) {
        await connectToDatabase();
        isMongoConnected = true;
        console.log('✅ MongoDB connected');
      } else {
        console.log('⚠️ MongoDB URI not found, using default data');
      }
    } catch (mongoError) {
      console.log('⚠️ MongoDB connection failed, using default data:', mongoError.message);
      isMongoConnected = false;
    }

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    switch (pathname) {
      case '/api/health':
        return res.status(200).json({
          success: true,
          message: 'API is working',
          mongodb: isMongoConnected ? 'connected' : 'using_defaults',
          timestamp: new Date().toISOString()
        });

      case '/api/home':
        return await handleHome(req, res);

      case '/api/about':
        return await handleAbout(req, res);

      case '/api/contact':
        return await handleContact(req, res);

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
    const { type, limit, language } = req.query;
    
    let query = { status: 'published' };
    if (type === 'featured') {
      query.is_featured = true;
    }

    let mongoQuery = Post.find(query).sort({ publishedAt: -1 });
    
    if (limit && !isNaN(parseInt(limit))) {
      mongoQuery = mongoQuery.limit(parseInt(limit));
    }

    const posts = await mongoQuery;

    // Frontend'in beklediği format
    const transformedPosts = posts.map(post => ({
      _id: post._id,
      id: post._id,
      title: post.title?.tr || '',
      title_tr: post.title?.tr || '',
      title_en: post.title?.en || '',
      excerpt: post.excerpt?.tr || '',
      excerpt_tr: post.excerpt?.tr || '',
      excerpt_en: post.excerpt?.en || '',
      slug: post.slug?.tr || '',
      slug_tr: post.slug?.tr || '',
      slug_en: post.slug?.en || '',
      featured_image: post.featured_image || '',
      image_url: post.featured_image || '',
      imageUrl: post.featured_image || '',
      category_id: post.category_id,
      tags: post.tags,
      tags_tr: post.tags?.tr || [],
      tags_en: post.tags?.en || [],
      is_featured: post.is_featured,
      status: post.status,
      view_count: post.view_count,
      like_count: post.like_count,
      read_time: post.read_time,
      readTime: post.read_time,
      publishedAt: post.publishedAt,
      published_at: post.publishedAt,
      categories: [] // Blog sayfası için categories array bekliyor
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

    // Eğer database'de kategori yoksa default'ları dön
    if (categories.length === 0) {
      const defaultCategories = [
        {
          _id: 'default-1',
          name: {
            tr: 'Beslenme İpuçları',
            en: 'Nutrition Tips'
          },
          slug: 'beslenme-ipuclari',
          color: '#4CAF50',
          icon: 'nutrition',
          order_index: 1,
          is_active: true
        },
        {
          _id: 'default-2',
          name: {
            tr: 'Kilo Yönetimi',
            en: 'Weight Management'
          },
          slug: 'kilo-yonetimi',
          color: '#2196F3',
          icon: 'weight',
          order_index: 2,
          is_active: true
        },
        {
          _id: 'default-3',
          name: {
            tr: 'Sağlıklı Yaşam',
            en: 'Healthy Living'
          },
          slug: 'saglikli-yasam',
          color: '#FF9800',
          icon: 'health',
          order_index: 3,
          is_active: true
        },
        {
          _id: 'default-4',
          name: {
            tr: 'Spor Beslenmesi',
            en: 'Sports Nutrition'
          },
          slug: 'spor-beslenmesi',
          color: '#E91E63',
          icon: 'sports',
          order_index: 4,
          is_active: true
        }
      ];

      return res.status(200).json({
        success: true,
        data: defaultCategories
      });
    }

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
    const { type, language } = req.query;
    
    let query = {};
    if (type === 'featured' || type === 'home-featured') {
      query.featured = true;
    }
    if (type === 'popular') {
      query.popular = true;
    }

    const packages = await Package.find(query);

    // Eğer database'de paket yoksa default'ları dön
    if (packages.length === 0) {
      const defaultPackages = [
        {
          _id: 'default-1',
          id: 'default-1',
          name: {
            tr: 'Temel Beslenme Danışmanlığı',
            en: 'Basic Nutrition Consultation'
          },
          title: {
            tr: 'Temel Beslenme Danışmanlığı',
            en: 'Basic Nutrition Consultation'
          },
          description: {
            tr: 'Kişiselleştirilmiş beslenme programı ve haftalık takip hizmeti',
            en: 'Personalized nutrition program and weekly follow-up service'
          },
          price: 299,
          originalPrice: 399,
          duration: '4 hafta',
          features: [
            { tr: 'Kişisel beslenme programı', en: 'Personal nutrition program' },
            { tr: 'Haftalık takip', en: 'Weekly follow-up' },
            { tr: 'WhatsApp desteği', en: 'WhatsApp support' },
            { tr: 'Alışveriş listesi', en: 'Shopping list' }
          ],
          featured: true,
          popular: false,
          isPopular: false,
          category: 'basic',
          icon: '🥗',
          color: '#4CAF50',
          title_tr: 'Temel Beslenme Danışmanlığı',
          title_en: 'Basic Nutrition Consultation',
          description_tr: 'Kişiselleştirilmiş beslenme programı ve haftalık takip hizmeti',
          description_en: 'Personalized nutrition program and weekly follow-up service',
          duration_tr: '4 hafta',
          duration_en: '4 weeks'
        },
        {
          _id: 'default-2',
          id: 'default-2',
          name: {
            tr: 'Premium Beslenme Programı',
            en: 'Premium Nutrition Program'
          },
          title: {
            tr: 'Premium Beslenme Programı',
            en: 'Premium Nutrition Program'
          },
          description: {
            tr: 'Kapsamlı beslenme danışmanlığı ve sürekli mentörlük',
            en: 'Comprehensive nutrition consultation and continuous mentoring'
          },
          price: 599,
          originalPrice: 799,
          duration: '12 hafta',
          features: [
            { tr: 'Detaylı vücut analizi', en: 'Detailed body analysis' },
            { tr: 'Kişisel beslenme programı', en: 'Personal nutrition program' },
            { tr: '7/24 WhatsApp desteği', en: '24/7 WhatsApp support' },
            { tr: 'Aylık vücut ölçümleri', en: 'Monthly body measurements' },
            { tr: 'Egzersiz programı', en: 'Exercise program' }
          ],
          featured: true,
          popular: true,
          isPopular: true,
          category: 'premium',
          icon: '⭐',
          color: '#FF9800',
          title_tr: 'Premium Beslenme Programı',
          title_en: 'Premium Nutrition Program',
          description_tr: 'Kapsamlı beslenme danışmanlığı ve sürekli mentörlük',
          description_en: 'Comprehensive nutrition consultation and continuous mentoring',
          duration_tr: '12 hafta',
          duration_en: '12 weeks'
        },
        {
          _id: 'default-3',
          id: 'default-3',
          name: {
            tr: 'Spor Beslenmesi',
            en: 'Sports Nutrition'
          },
          title: {
            tr: 'Spor Beslenmesi',
            en: 'Sports Nutrition'
          },
          description: {
            tr: 'Sporcu performansını artırmaya yönelik özel beslenme programı',
            en: 'Special nutrition program to improve athlete performance'
          },
          price: 499,
          originalPrice: 699,
          duration: '8 hafta',
          features: [
            { tr: 'Spor öncesi/sonrası beslenme', en: 'Pre/post workout nutrition' },
            { tr: 'Performans artırıcı programlar', en: 'Performance enhancing programs' },
            { tr: 'Supplement tavsiyeleri', en: 'Supplement recommendations' },
            { tr: 'Antrenör ile koordinasyon', en: 'Coordination with trainer' }
          ],
          featured: false,
          popular: false,
          isPopular: false,
          category: 'sports',
          icon: '🏃‍♂️',
          color: '#2196F3',
          title_tr: 'Spor Beslenmesi',
          title_en: 'Sports Nutrition',
          description_tr: 'Sporcu performansını artırmaya yönelik özel beslenme programı',
          description_en: 'Special nutrition program to improve athlete performance',
          duration_tr: '8 hafta',
          duration_en: '8 weeks'
        }
      ];

      // Query filtrelerine göre default paketleri filtrele
      let filteredPackages = defaultPackages;
      
      if (type === 'featured' || type === 'home-featured') {
        filteredPackages = defaultPackages.filter(pkg => pkg.featured);
      }
      if (type === 'popular') {
        filteredPackages = defaultPackages.filter(pkg => pkg.popular);
      }

      return res.status(200).json({
        success: true,
        data: filteredPackages
      });
    }

    // Frontend'in beklediği format
    const transformedPackages = packages.map(pkg => ({
      _id: pkg._id,
      id: pkg._id,
      name: pkg.name,
      title: pkg.name, // Frontend title bekliyor
      description: pkg.description,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      duration: pkg.duration,
      features: pkg.features,
      featured: pkg.featured,
      popular: pkg.popular,
      isPopular: pkg.popular, // Frontend isPopular da bekliyor
      category: pkg.category,
      icon: pkg.icon,
      color: pkg.color,
      // Ek alanlar frontend için
      title_tr: pkg.name?.tr || '',
      title_en: pkg.name?.en || '',
      description_tr: pkg.description?.tr || '',
      description_en: pkg.description?.en || '',
      duration_tr: pkg.duration,
      duration_en: pkg.duration
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

    // Eğer database'de testimonial yoksa default'ları dön
    if (testimonials.length === 0) {
      const defaultTestimonials = [
        {
          _id: 'default-1',
          name: 'Ayşe K.',
          title: 'Müşteri',
          content: {
            tr: 'Oğuz Bey ile çalışmaya başladıktan sonra hem sağlığım hem de enerjim çok arttı. Beslenme programı tamamen kişiselleştirilmişti ve çok pratikti.',
            en: 'After I started working with Oğuz, both my health and energy increased a lot. The nutrition program was completely personalized and very practical.'
          },
          rating: 5,
          avatar: null,
          status: 'approved',
          createdAt: new Date('2024-01-15')
        },
        {
          _id: 'default-2',
          name: 'Mehmet A.',
          title: 'Sporcu',
          content: {
            tr: '6 ayda 15 kilo verdim ve performansımı artırdım. Oğuz Bey\'in yaklaşımı çok profesyonel ve etkili.',
            en: 'I lost 15 kg in 6 months and increased my performance. Oğuz\'s approach is very professional and effective.'
          },
          rating: 5,
          avatar: null,
          status: 'approved',
          createdAt: new Date('2024-02-10')
        },
        {
          _id: 'default-3',
          name: 'Zeynep T.',
          title: 'Öğretmen',
          content: {
            tr: 'Yıllardır denediğim diyetlerden farklı olarak bu sefer gerçekten kalıcı sonuçlar aldım. Teşekkürler Oğuz Bey!',
            en: 'Unlike the diets I have tried for years, this time I got really permanent results. Thank you Oğuz!'
          },
          rating: 5,
          avatar: null,
          status: 'approved',
          createdAt: new Date('2024-03-05')
        }
      ];

      // Limit uygulaması
      const limitedTestimonials = limit && !isNaN(parseInt(limit)) 
        ? defaultTestimonials.slice(0, parseInt(limit))
        : defaultTestimonials;

      return res.status(200).json({
        success: true,
        data: limitedTestimonials
      });
    }

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

    // Eğer database'de FAQ yoksa default FAQ'ları dön
    if (faqs.length === 0) {
      const defaultFAQs = [
        {
          _id: 'default-1',
          question: {
            tr: 'Beslenme danışmanlığı nasıl yapılır?',
            en: 'How is nutrition consultation conducted?'
          },
          answer: {
            tr: 'Beslenme danışmanlığı kişisel ihtiyaçlarınıza göre özel olarak hazırlanır. İlk görüşmede detaylı anamnez alınır ve size özel beslenme programı hazırlanır.',
            en: 'Nutrition consultation is prepared specifically according to your personal needs. In the first interview, detailed anamnesis is taken and a special nutrition program is prepared for you.'
          },
          category: 'general',
          order_index: 1,
          is_active: true
        },
        {
          _id: 'default-2',
          question: {
            tr: 'Kaç günde sonuç alırım?',
            en: 'How many days will I see results?'
          },
          answer: {
            tr: 'Beslenme programına uyum sağladığınızda ilk 2-3 hafta içinde değişimleri fark etmeye başlarsınız. Kalıcı sonuçlar için 3-6 aylık süreç önerilir.',
            en: 'When you adapt to the nutrition program, you will start to notice changes within the first 2-3 weeks. A 3-6 month process is recommended for permanent results.'
          },
          category: 'general',
          order_index: 2,
          is_active: true
        },
        {
          _id: 'default-3',
          question: {
            tr: 'Online danışmanlık nasıl çalışır?',
            en: 'How does online consultation work?'
          },
          answer: {
            tr: 'Online danışmanlık video görüşme üzerinden yapılır. Tüm belgeler dijital ortamda paylaşılır ve WhatsApp üzerinden sürekli iletişim halinde oluruz.',
            en: 'Online consultation is conducted via video call. All documents are shared digitally and we stay in constant communication via WhatsApp.'
          },
          category: 'online',
          order_index: 3,
          is_active: true
        }
      ];

      return res.status(200).json({
        success: true,
        data: defaultFAQs
      });
    }

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

// Home Page Handler
async function handleHome(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const homeContent = await HomeContent.findOne({ is_active: true })
      .sort({ last_updated: -1 });

    if (!homeContent) {
      // Return default content if nothing in database
      const defaultContent = {
        hero_section: {
          title: {
            tr: 'Sağlıklı Yaşam İçin Doğru Adres',
            en: 'The Right Address for Healthy Living'
          },
          subtitle: {
            tr: 'Uzman Diyetisyen Oğuz Yolyapan',
            en: 'Expert Dietitian Oğuz Yolyapan'
          },
          description: {
            tr: 'Kişiselleştirilmiş beslenme programları ile hedeflerinize ulaşın',
            en: 'Reach your goals with personalized nutrition programs'
          },
          cta_button: {
            tr: 'Hemen Başla',
            en: 'Get Started'
          }
        },
        stats: [
          {
            label: { tr: 'Mutlu Müşteri', en: 'Happy Clients' },
            value: '1000+',
            icon: 'users'
          },
          {
            label: { tr: 'Deneyim Yılı', en: 'Years Experience' },
            value: '8+',
            icon: 'calendar'
          },
          {
            label: { tr: 'Başarı Oranı', en: 'Success Rate' },
            value: '%95',
            icon: 'trophy'
          }
        ],
        features: [
          {
            title: { tr: 'Kişisel Beslenme Planı', en: 'Personal Nutrition Plan' },
            description: { tr: 'Size özel hazırlanan beslenme programı', en: 'Customized nutrition program for you' },
            icon: 'clipboard-list',
            color: '#28a745'
          },
          {
            title: { tr: '7/24 Destek', en: '24/7 Support' },
            description: { tr: 'WhatsApp üzerinden sürekli destek', en: 'Continuous support via WhatsApp' },
            icon: 'headphones',
            color: '#007bff'
          },
          {
            title: { tr: 'Online Takip', en: 'Online Follow-up' },
            description: { tr: 'Düzenli kontroller ve takip', en: 'Regular check-ups and monitoring' },
            icon: 'chart-line',
            color: '#ffc107'
          }
        ]
      };

      return res.status(200).json({
        success: true,
        data: defaultContent
      });
    }

    return res.status(200).json({
      success: true,
      data: homeContent
    });
  } catch (error) {
    console.error('Home error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// About Page Handler
async function handleAbout(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const aboutContent = await About.findOne({ is_active: true })
      .sort({ last_updated: -1 });

    if (!aboutContent) {
      // Return default content if nothing in database
      const defaultContent = {
        personal_info: {
          name: 'Oğuz Yolyapan',
          title: {
            tr: 'Uzman Diyetisyen',
            en: 'Expert Dietitian'
          },
          bio: {
            tr: 'Sağlıklı beslenme konusunda uzmanlaşmış, kanıta dayalı yaklaşımları benimseyen deneyimli diyetisyen.',
            en: 'Experienced dietitian specializing in healthy nutrition with evidence-based approaches.'
          },
          experience_years: 8,
          specializations: {
            tr: ['Kilo Yönetimi', 'Spor Beslenmesi', 'Klinik Beslenme', 'Metabolik Hastalıklar'],
            en: ['Weight Management', 'Sports Nutrition', 'Clinical Nutrition', 'Metabolic Diseases']
          }
        },
        education: [
          {
            degree: {
              tr: 'Beslenme ve Diyetetik Lisans',
              en: 'Bachelor of Nutrition and Dietetics'
            },
            school: 'Başkent Üniversitesi',
            year: '2016',
            description: {
              tr: 'Beslenme bilimleri alanında kapsamlı eğitim',
              en: 'Comprehensive education in nutrition sciences'
            }
          }
        ],
        philosophy: {
          tr: 'Her birey özgün bir yaklaşım hak eder. Sürdürülebilir ve sağlıklı beslenme alışkanlıkları geliştirmek en büyük hedefimdir.',
          en: 'Every individual deserves a unique approach. Developing sustainable and healthy eating habits is our main goal.'
        },
        approach: {
          tr: 'Bilimsel veriler ışığında, kişiselleştirilmiş beslenme programları hazırlıyorum.',
          en: 'I prepare personalized nutrition programs in light of scientific data.'
        }
      };

      return res.status(200).json({
        success: true,
        data: defaultContent
      });
    }

    return res.status(200).json({
      success: true,
      data: aboutContent
    });
  } catch (error) {
    console.error('About error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// Contact Page Handler
async function handleContact(req, res) {
  if (req.method === 'GET') {
    try {
      const contactInfo = await Contact.findOne({ is_active: true })
        .sort({ last_updated: -1 });

      if (!contactInfo) {
        // Return default content if nothing in database
        const defaultContent = {
          office_info: {
            name: {
              tr: 'Oğuz Yolyapan Beslenme Danışmanlığı',
              en: 'Oğuz Yolyapan Nutrition Consulting'
            },
            address: {
              tr: 'Ataşehir, İstanbul',
              en: 'Ataşehir, Istanbul'
            },
            city: 'İstanbul',
            country: {
              tr: 'Türkiye',
              en: 'Turkey'
            }
          },
          contact_details: {
            phone: '+90 555 123 4567',
            whatsapp: '+90 555 123 4567',
            email: 'info@oguzyolyapan.com',
            website: 'www.oguzyolyapan.com'
          },
          social_media: {
            instagram: '@oguzyolyapan',
            linkedin: 'oguzyolyapan'
          },
          office_hours: [
            {
              day: { tr: 'Pazartesi', en: 'Monday' },
              hours: { tr: '09:00 - 18:00', en: '09:00 - 18:00' },
              is_open: true
            },
            {
              day: { tr: 'Salı', en: 'Tuesday' },
              hours: { tr: '09:00 - 18:00', en: '09:00 - 18:00' },
              is_open: true
            },
            {
              day: { tr: 'Çarşamba', en: 'Wednesday' },
              hours: { tr: '09:00 - 18:00', en: '09:00 - 18:00' },
              is_open: true
            },
            {
              day: { tr: 'Perşembe', en: 'Thursday' },
              hours: { tr: '09:00 - 18:00', en: '09:00 - 18:00' },
              is_open: true
            },
            {
              day: { tr: 'Cuma', en: 'Friday' },
              hours: { tr: '09:00 - 18:00', en: '09:00 - 18:00' },
              is_open: true
            },
            {
              day: { tr: 'Cumartesi', en: 'Saturday' },
              hours: { tr: 'Kapalı', en: 'Closed' },
              is_open: false
            },
            {
              day: { tr: 'Pazar', en: 'Sunday' },
              hours: { tr: 'Kapalı', en: 'Closed' },
              is_open: false
            }
          ],
          // Frontend için konum bilgisi
          location: {
            lat: 40.9874,
            lng: 29.1275
          }
        };

        return res.status(200).json({
          success: true,
          data: defaultContent
        });
      }

      return res.status(200).json({
        success: true,
        data: contactInfo
      });
    } catch (error) {
      console.error('Contact error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, phone, subject, message } = req.body;

      // Contact formu gönderimi - şimdilik log
      console.log('Contact form submission:', {
        name,
        email,
        phone,
        subject,
        message,
        timestamp: new Date()
      });

      return res.status(200).json({
        success: true,
        message: {
          tr: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
          en: 'Your message has been sent successfully. We will get back to you soon.'
        }
      });

    } catch (error) {
      console.error('Contact submit error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
