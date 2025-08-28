import connectDB from './mongodb.js';
import User from '../models/User.js';
import Package from '../models/Package.js';
import Testimonial from '../models/Testimonial.js';
import Post from '../models/Post.js';
import jwt from 'jsonwebtoken';

// MongoDB bağlantısını başlat
let isConnected = false;

const ensureConnection = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// Authentication Helper Functions
export const auth = {
  // JWT token oluştur
  generateToken: (userId, role = 'user') => {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    console.log('🔑 JWT_SECRET check:', process.env.JWT_SECRET ? 'Found' : 'Not found');
    return jwt.sign(
      { userId, role },
      secret,
      { expiresIn: '7d' }
    );
  },

  // JWT token doğrula
  verifyToken: (token) => {
    try {
      const secret = process.env.JWT_SECRET || 'fallback-secret-key';
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error('Geçersiz token');
    }
  },

  // Login işlemi
  login: async (email, password) => {
    await ensureConnection();
    
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    if (user.isLocked) {
      throw new Error('Hesap geçici olarak kilitli. Lütfen daha sonra tekrar deneyin.');
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      await user.incLoginAttempts();
      throw new Error('Geçersiz şifre');
    }

    await user.resetLoginAttempts();
    
    const token = auth.generateToken(user._id, user.role);
    
    return {
      user: user.toJSON(),
      token
    };
  },

  // Kayıt işlemi
  register: async (userData) => {
    await ensureConnection();
    
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Bu email adresi zaten kullanılıyor');
    }

    const user = new User(userData);
    await user.save();
    
    const token = auth.generateToken(user._id, user.role);
    
    return {
      user: user.toJSON(),
      token
    };
  },

  // Kullanıcı bilgilerini getir
  getUser: async (userId) => {
    await ensureConnection();
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    return user.toJSON();
  }
};

// Package Operations
export const packages = {
  // Tüm aktif paketleri getir
  getAll: async (language = 'tr') => {
    await ensureConnection();
    return await Package.getActivePackages(language);
  },

  // Popüler paketleri getir
  getPopular: async (language = 'tr') => {
    await ensureConnection();
    return await Package.getPopularPackages(language);
  },

  // ID'ye göre paket getir
  getById: async (id) => {
    await ensureConnection();
    const pkg = await Package.findById(id);
    if (!pkg) {
      throw new Error('Paket bulunamadı');
    }
    return pkg;
  },

  // Yeni paket oluştur (Admin)
  create: async (packageData) => {
    await ensureConnection();
    const pkg = new Package(packageData);
    await pkg.save();
    return pkg;
  },

  // Paket güncelle (Admin)
  update: async (id, updateData) => {
    await ensureConnection();
    const pkg = await Package.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });
    if (!pkg) {
      throw new Error('Paket bulunamadı');
    }
    return pkg;
  },

  // Paket sil (Admin)
  delete: async (id) => {
    await ensureConnection();
    const pkg = await Package.findByIdAndDelete(id);
    if (!pkg) {
      throw new Error('Paket bulunamadı');
    }
    return { message: 'Paket başarıyla silindi' };
  }
};

// Testimonial Operations
export const testimonials = {
  // Onaylanmış testimonial'ları getir
  getApproved: async (language = 'tr', limit = null) => {
    await ensureConnection();
    return await Testimonial.getApproved(language, limit);
  },

  // Öne çıkan testimonial'ları getir
  getFeatured: async (language = 'tr') => {
    await ensureConnection();
    return await Testimonial.getFeatured(language);
  },

  // Yeni testimonial oluştur
  create: async (testimonialData) => {
    await ensureConnection();
    const testimonial = new Testimonial(testimonialData);
    await testimonial.save();
    return testimonial;
  },

  // Testimonial onayla (Admin)
  approve: async (id, adminId) => {
    await ensureConnection();
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { 
        status: 'approved',
        approvedBy: adminId,
        approvedAt: new Date()
      },
      { new: true }
    );
    if (!testimonial) {
      throw new Error('Testimonial bulunamadı');
    }
    return testimonial;
  },

  // Testimonial reddet (Admin)
  reject: async (id, reason = '') => {
    await ensureConnection();
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { 
        status: 'rejected',
        moderationNotes: reason,
        rejectedAt: new Date()
      },
      { new: true }
    );
    if (!testimonial) {
      throw new Error('Testimonial bulunamadı');
    }
    return testimonial;
  },

  // Puan ortalamalarını getir
  getStats: async () => {
    await ensureConnection();
    return await Testimonial.getAverageRating();
  }
};

// Blog Operations
export const blog = {
  // Post dönüşüm helper'ı - MongoDB format'tan UI format'a
  transformPostForUI: (post) => {
    if (!post) return null;
    
    console.log('Transform input post:', {
      _id: post._id,
      title: post.title,
      id_type: typeof post._id
    });
    
    const result = {
      _id: post._id?.toString() || '',
      id: post._id?.toString() || '', // Backward compatibility
      title_tr: post.title?.tr || '',
      title_en: post.title?.en || '',
      slug_tr: post.slug?.tr || '',
      slug_en: post.slug?.en || '',
      content_tr: post.content?.tr || '',
      content_en: post.content?.en || '',
      excerpt_tr: post.excerpt?.tr || '',
      excerpt_en: post.excerpt?.en || '',
      image_url: post.imageUrl || '',
      image_alt_text: post.imageAltText?.tr || '',
      category_id: post.categories?.[0]?.toString() || '',
      tags_tr: post.tags?.tr || [],
      tags_en: post.tags?.en || [],
      meta_title_tr: post.metaTitle?.tr || '',
      meta_title_en: post.metaTitle?.en || '',
      meta_description_tr: post.metaDescription?.tr || '',
      meta_description_en: post.metaDescription?.en || '',
      meta_keywords_tr: post.seo?.keywords?.tr || '',
      meta_keywords_en: post.seo?.keywords?.en || '',
      status: post.status || 'draft',
      is_featured: post.isFeatured || false,
      published_at: post.publishedAt,
      scheduled_at: post.scheduledAt,
      author_name: post.authorId?.firstName && post.authorId?.lastName 
        ? `${post.authorId.firstName} ${post.authorId.lastName}` 
        : 'Oğuz Yolyapan',
      author_bio_tr: post.authorId?.bio?.tr || '',
      author_bio_en: post.authorId?.bio?.en || '',
      author_image: post.authorId?.avatarUrl || '',
      read_time: post.readTime || 5,
      views: post.views || 0,
      created_at: post.createdAt,
      updated_at: post.updatedAt
    };
    
    console.log('Transform output result:', {
      id: result.id,
      _id: result._id,
      title_tr: result.title_tr
    });
    
    return result;
  },

  // UI format'tan MongoDB format'a dönüşüm
  transformPostFromUI: (formData) => {
    // Slug oluşturma fonksiyonu
    const createSlug = (text) => {
      return text
        .toLowerCase()
        .replace(/[çğıöşü]/g, match => ({
          'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u'
        }[match] || match))
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    };

    return {
      title: {
        tr: formData.title_tr || '',
        en: formData.title_en || ''
      },
      slug: {
        tr: formData.slug_tr || createSlug(formData.title_tr || '') + '-' + Date.now(),
        en: formData.slug_en || createSlug(formData.title_en || '') + '-' + Date.now()
      },
      content: {
        tr: formData.content_tr || '',
        en: formData.content_en || ''
      },
      excerpt: {
        tr: formData.excerpt_tr || '',
        en: formData.excerpt_en || ''
      },
      imageUrl: formData.image_url || '',
      imageAltText: {
        tr: formData.image_alt_text || '',
        en: formData.image_alt_text || ''
      },
      categories: formData.category_id ? [formData.category_id] : [],
      tags: {
        tr: formData.tags_tr || [],
        en: formData.tags_en || []
      },
      seo: {
        title: {
          tr: formData.meta_title_tr || '',
          en: formData.meta_title_en || ''
        },
        description: {
          tr: formData.meta_description_tr || '',
          en: formData.meta_description_en || ''
        },
        keywords: {
          tr: formData.meta_keywords_tr || '',
          en: formData.meta_keywords_en || ''
        }
      },
      // Gerçek admin ID'si - daha sonra giriş yapmış kullanıcı ID'si ile değiştirilecek
      authorId: '674bc89c5fc7529b6a2b3c3b', // admin@oguzyolyapan.com'un gerçek ID'si
      status: formData.status || 'draft',
      isFeatured: formData.is_featured || false,
      publishedAt: formData.published_at || null,
      scheduledAt: formData.scheduled_at || null,
      author: {
        name: formData.author_name || 'Oğuz Yolyapan',
        bio: {
          tr: formData.author_bio_tr || '',
          en: formData.author_bio_en || ''
        },
        image: formData.author_image || ''
      },
      readTime: formData.read_time || 5
    };
  },

  // Tüm postları getir (Admin için - draft, published, archived dahil)
  getAllPosts: async (language = 'tr', limit = null, categories = null) => {
    await ensureConnection();
    
    let query = {};
    
    if (categories) {
      if (typeof categories === 'string') {
        const categoryArray = categories.split(',').map(cat => cat.trim());
        query.categories = { $in: categoryArray };
      } else if (Array.isArray(categories)) {
        query.categories = { $in: categories };
      }
    }

    let posts = Post.find(query)
      .populate('authorId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    if (limit) {
      posts = posts.limit(limit);
    }

    const results = await posts.exec();
    console.log('Raw MongoDB results:', results[0]); // Debug log
    return results.map(post => blog.transformPostForUI(post));
  },

  // Yayınlanmış postları getir (Public)
  getPosts: async (language = 'tr', limit = null, categories = null) => {
    await ensureConnection();
    const results = await Post.getPublished(language, limit, categories);
    return results.map(post => blog.transformPostForUI(post));
  },

  // Öne çıkan postları getir
  getFeatured: async (language = 'tr', limit = 3) => {
    await ensureConnection();
    const posts = await Post.find({ 
      status: 'published',
      isFeatured: true 
    })
    .sort({ publishedAt: -1 })
    .limit(limit);
    
    return posts.map(post => blog.transformPostForUI(post.toJSON()));
  },

  // Popüler postları getir
  getPopular: async (language = 'tr', limit = 5) => {
    await ensureConnection();
    const posts = await Post.find({ 
      status: 'published' 
    })
    .sort({ viewCount: -1 })
    .limit(limit);
    
    return posts.map(post => blog.transformPostForUI(post.toJSON()));
  },

  // Slug'a göre post getir
  getBySlug: async (slug, language = 'tr') => {
    await ensureConnection();
    
    const slugField = language === 'en' ? 'slug.en' : 'slug.tr';
    const post = await Post.findOne({ 
      [slugField]: slug,
      status: 'published'
    });
    
    if (!post) {
      throw new Error('Blog yazısı bulunamadı');
    }
    
    return blog.transformPostForUI(post.toJSON());
  },

  // ID'ye göre post getir (Admin)
  getById: async (id) => {
    await ensureConnection();
    const post = await Post.findById(id).populate('authorId', 'firstName lastName email');
    if (!post) {
      throw new Error('Blog yazısı bulunamadı');
    }
    return blog.transformPostForUI(post.toJSON());
  },

  // Yeni post oluştur (Admin)
  create: async (postData) => {
    await ensureConnection();
    const mongoData = blog.transformPostFromUI(postData);
    const post = new Post(mongoData);
    await post.save();
    return blog.transformPostForUI(post.toJSON());
  },

  // Post güncelle (Admin)
  update: async (id, updateData) => {
    await ensureConnection();
    const mongoData = blog.transformPostFromUI(updateData);
    const post = await Post.findByIdAndUpdate(id, mongoData, { 
      new: true, 
      runValidators: true 
    }).populate('authorId', 'firstName lastName email');
    if (!post) {
      throw new Error('Blog yazısı bulunamadı');
    }
    return blog.transformPostForUI(post.toJSON());
  },

  // Post sil (Admin)
  delete: async (id) => {
    await ensureConnection();
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      throw new Error('Blog yazısı bulunamadı');
    }
    return { message: 'Blog yazısı başarıyla silindi' };
  },

  // Post kategorilerini getir
  getCategories: async () => {
    await ensureConnection();
    const categories = await Post.distinct('categories');
    return categories.filter(cat => cat && cat.trim() !== '');
  },

  // Post etiketlerini getir
  getTags: async (language = 'tr') => {
    await ensureConnection();
    const tagField = language === 'en' ? 'tags.en' : 'tags.tr';
    const tags = await Post.distinct(tagField);
    return tags.filter(tag => tag && tag.trim() !== '');
  },

  // View count artır
  incrementView: async (id) => {
    await ensureConnection();
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!post) {
      throw new Error('Blog yazısı bulunamadı');
    }
    return { viewCount: post.viewCount };
  },

  // Like/unlike post
  toggleLike: async (id) => {
    await ensureConnection();
    const post = await Post.findById(id);
    if (!post) {
      throw new Error('Blog yazısı bulunamadı');
    }
    
    // Basit like toggle - gerçek uygulamada user tracking olmalı
    const newLikeCount = (post.likeCount || 0) + 1;
    
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likeCount: newLikeCount },
      { new: true }
    );
    
    return { likeCount: updatedPost.likeCount };
  },

  // Related posts getir (aynı kategorideki diğer postlar)
  getRelatedPosts: async (id, language = 'tr', limit = 3) => {
    await ensureConnection();
    
    const currentPost = await Post.findById(id);
    if (!currentPost) {
      throw new Error('Blog yazısı bulunamadı');
    }

    const relatedPosts = await Post.find({
      _id: { $ne: id },
      status: 'published',
      categories: { $in: currentPost.categories }
    })
    .sort({ publishedAt: -1 })
    .limit(limit);

    return relatedPosts.map(post => blog.transformPostForUI(post.toJSON()));
  }
};

// Utility Functions
export const utils = {
  // Test bağlantısı
  testConnection: async () => {
    try {
      await ensureConnection();
      return { status: 'success', message: 'MongoDB bağlantısı başarılı' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  },

  // Veritabanı istatistikleri
  getStats: async () => {
    await ensureConnection();
    
    const [userCount, packageCount, testimonialCount, postCount] = await Promise.all([
      User.countDocuments(),
      Package.countDocuments({ isActive: true }),
      Testimonial.countDocuments({ status: 'approved' }),
      Post.countDocuments({ status: 'published' })
    ]);

    return {
      users: userCount,
      packages: packageCount,
      testimonials: testimonialCount,
      posts: postCount
    };
  }
};

// Default export (backward compatibility)
const mongoClient = {
  auth,
  packages,
  testimonials,
  blog,
  utils
};

export default mongoClient;
