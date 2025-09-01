// Frontend API client - tarayıcıda çalışır, jsonwebtoken kullanmaz

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://oguz-dietitian-backend.vercel.app/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // body objesi varsa JSON.stringify yap
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log(`🌐 API Request: ${config.method} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        const errorData = await response.json().catch(() => ({ message: 'API endpoint bulunamadı' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      
      // CORS hatası için fallback response
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        console.warn('🔄 CORS error detected, returning fallback data');
        return this.getFallbackData(endpoint);
      }
      
      throw error;
    }
  }

  // Fallback data for CORS issues
  getFallbackData(endpoint) {
    console.log(`📋 Getting fallback data for: ${endpoint}`);
    
    if (endpoint.includes('testimonials')) {
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Ayşe K.',
            title: 'Öğretmen',
            city: 'İstanbul',
            content_tr: 'Oğuz Bey ile çalışmak harika bir deneyimdi. Hedeflerime ulaştım.',
            content_en: 'Working with Oğuz was a wonderful experience. I reached my goals.',
            content: {
              tr: 'Oğuz Bey ile çalışmak harika bir deneyimdi. Hedeflerime ulaştım.',
              en: 'Working with Oğuz was a wonderful experience. I reached my goals.'
            },
            rating: 5,
            program_type: 'Kilo Verme Programı',
            status: 'approved',
            approved: true
          },
          {
            id: 2,
            name: 'Mehmet S.',
            title: 'Mühendis',
            city: 'Ankara',
            content_tr: 'Profesyonel yaklaşımı sayesinde sağlıklı kilo verdim.',
            content_en: 'Thanks to his professional approach, I lost weight healthily.',
            content: {
              tr: 'Profesyonel yaklaşımı sayesinde sağlıklı kilo verdim.',
              en: 'Thanks to his professional approach, I lost weight healthily.'
            },
            rating: 5,
            program_type: 'Sporcu Beslenmesi',
            status: 'approved',
            approved: true
          }
        ]
      };
    }
    
    if (endpoint.includes('packages')) {
      return {
        success: true,
        data: [
          {
            id: 1,
            name: { tr: 'Temel Beslenme Paketi', en: 'Basic Nutrition Package' },
            name_tr: 'Temel Beslenme Paketi',
            name_en: 'Basic Nutrition Package',
            description: {
              tr: 'Sağlıklı beslenme alışkanlıkları kazanmak isteyenler için ideal paket.',
              en: 'Ideal package for those who want to develop healthy eating habits.'
            },
            price: 500,
            features: {
              tr: ['Kişisel beslenme planı', '1 aylık takip', 'WhatsApp desteği'],
              en: ['Personal nutrition plan', '1 month follow-up', 'WhatsApp support']
            },
            featured: true
          },
          {
            id: 2,
            name: { tr: 'Premium Beslenme Paketi', en: 'Premium Nutrition Package' },
            name_tr: 'Premium Beslenme Paketi',
            name_en: 'Premium Nutrition Package',
            description: {
              tr: 'Kapsamlı beslenme danışmanlığı ve uzun süreli takip.',
              en: 'Comprehensive nutrition consulting and long-term follow-up.'
            },
            price: 800,
            features: {
              tr: ['Detaylı analiz', '3 aylık takip', '24/7 destek'],
              en: ['Detailed analysis', '3 month follow-up', '24/7 support']
            },
            featured: true,
            popular: true
          }
        ]
      };
    }
    
    if (endpoint.includes('categories')) {
      return {
        success: true,
        data: [
          {
            _id: '1',
            id: '1',
            name: { tr: 'Genel Beslenme', en: 'General Nutrition' },
            name_tr: 'Genel Beslenme',
            name_en: 'General Nutrition',
            slug: { tr: 'genel-beslenme', en: 'general-nutrition' },
            color: '#28a745',
            icon: 'leaf'
          },
          {
            _id: '2',
            id: '2',
            name: { tr: 'Kilo Yönetimi', en: 'Weight Management' },
            name_tr: 'Kilo Yönetimi',
            name_en: 'Weight Management',
            slug: { tr: 'kilo-yonetimi', en: 'weight-management' },
            color: '#007bff',
            icon: 'scale'
          }
        ]
      };
    }
    
    if (endpoint.includes('blog')) {
      return {
        success: true,
        data: [
          {
            _id: '1',
            id: '1',
            title: { tr: 'Sağlıklı Beslenme İpuçları', en: 'Healthy Eating Tips' },
            title_tr: 'Sağlıklı Beslenme İpuçları',
            title_en: 'Healthy Eating Tips',
            excerpt: {
              tr: 'Günlük yaşamınızda uygulayabileceğiniz basit beslenme önerileri.',
              en: 'Simple nutrition tips you can apply in your daily life.'
            },
            excerpt_tr: 'Günlük yaşamınızda uygulayabileceğiniz basit beslenme önerileri.',
            excerpt_en: 'Simple nutrition tips you can apply in your daily life.',
            slug: { tr: 'saglikli-beslenme-ipuclari', en: 'healthy-eating-tips' },
            slug_tr: 'saglikli-beslenme-ipuclari',
            slug_en: 'healthy-eating-tips',
            featured_image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop',
            category_id: '1',
            is_featured: true,
            view_count: 1245,
            read_time: 5,
            published_at: new Date().toISOString()
          }
        ]
      };
    }
    
    return { success: false, data: [], message: 'No fallback data available' };
  }

  // 🔹 Auth endpoints
  async login(email, password) {
    return this.request('/auth?type=login', {
      method: 'POST',
      body: { email, password }
    });
  }

  async register(userData) {
    return this.request('/auth?type=register', {
      method: 'POST',
      body: userData
    });
  }

  async getProfile(userId) {
    return this.request('/auth?type=profile', {
      method: 'POST',
      body: { userId }
    });
  }

  // 🔹 Packages endpoints
  async getPackages(language = 'tr') {
    return this.request(`/packages?language=${language}`);
  }

  async getPopularPackages(language = 'tr') {
    return this.request(`/packages?type=popular&language=${language}`);
  }

  async getHomeFeaturedPackages(language = 'tr') {
    return this.request(`/packages?type=home-featured&language=${language}`);
  }

  // 🔹 Testimonials endpoints
  async getApprovedTestimonials(language = 'tr', limit = null) {
    const params = new URLSearchParams({ language, type: 'approved' });
    if (limit) params.append('limit', limit);
    return this.request(`/testimonials?${params}`);
  }

  // 🔹 FAQ endpoints
  async getFAQItems(language = 'tr') {
    return this.request(`/faq?type=items&language=${language}`);
  }

  async getFAQCategories(language = 'tr') {
    return this.request(`/faq?type=categories&language=${language}`);
  }

  // 🔹 Blog endpoints
  async getAllPosts(language = 'tr', limit = null, categories = null, status = 'all') {
    const params = new URLSearchParams({
      language,
      ...(limit && { limit }),
      ...(categories && { categories }),
      ...(status && { status })
    });
    
    const response = await this.request(`/blog?${params}`);
    if (!response.success) {
      throw new Error(response.message || 'Blog yazıları alınamadı');
    }
    return response;
  }

  async getPublishedPosts(language = 'tr', limit = null, categories = null) {
    const params = new URLSearchParams({
      language,
      type: 'published',
      ...(limit && { limit }),
      ...(categories && { categories })
    });
    
    return this.request(`/blog?${params}`);
  }

  async getFeaturedPosts(language = 'tr', limit = 3) {
    return this.request(`/blog?type=featured&language=${language}&limit=${limit}`);
  }

  async getPopularPosts(language = 'tr', limit = 5) {
    return this.request(`/blog?type=popular&language=${language}&limit=${limit}`);
  }

  async getPostBySlug(slug, language = 'tr') {
    return this.request(`/blog?slug=${slug}&language=${language}`);
  }

  async getPostById(id) {
    return this.request(`/blog?id=${id}`);
  }

  // Create new blog post
  async createPost(postData) {
    try {
      console.log('Creating post with data:', postData);
      
      // Validate required fields
      if (!postData.title_tr || !postData.title_en) {
        throw new Error('Başlık gerekli (hem Türkçe hem İngilizce)');
      }
      
      if (!postData.content_tr || !postData.content_en) {
        throw new Error('İçerik gerekli (hem Türkçe hem İngilizce)');
      }

      // Transform data to match backend expectations
      const transformedData = {
        title: {
          tr: postData.title_tr,
          en: postData.title_en
        },
        slug: {
          tr: postData.slug_tr || this.generateSlug(postData.title_tr),
          en: postData.slug_en || this.generateSlug(postData.title_en)
        },
        content: {
          tr: postData.content_tr,
          en: postData.content_en
        },
        excerpt: {
          tr: postData.excerpt_tr || '',
          en: postData.excerpt_en || ''
        },
        imageUrl: postData.featured_image || '',
        imageAltText: {
          tr: postData.image_alt_tr || '',
          en: postData.image_alt_en || ''
        },
        status: postData.status || 'draft',
        isFeatured: Boolean(postData.is_featured),
        allowComments: postData.allow_comments !== false,
        readTime: parseInt(postData.read_time) || 5,
        authorId: postData.authorId || '674bc89c5fc7529b6a2b3c3b',
        // Categories geçici olarak boş bırak
        categories: [],
        tags: {
          tr: Array.isArray(postData.tags_tr) ? postData.tags_tr : 
              (typeof postData.tags_tr === 'string' ? postData.tags_tr.split(',').map(t => t.trim()).filter(t => t) : []),
          en: Array.isArray(postData.tags_en) ? postData.tags_en : 
              (typeof postData.tags_en === 'string' ? postData.tags_en.split(',').map(t => t.trim()).filter(t => t) : [])
        },
        metaTitle: {
          tr: postData.meta_title_tr || '',
          en: postData.meta_title_en || ''
        },
        metaDescription: {
          tr: postData.meta_description_tr || '',
          en: postData.meta_description_en || ''
        }
      };

      console.log('Transformed data:', transformedData);

      const response = await this.request('/blog', {
        method: 'POST',
        body: transformedData
      });
      
      console.log('Create post response:', response);
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Create post error:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper function to generate slug
  generateSlug(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[çÇ]/g, 'c')
      .replace(/[ğĞ]/g, 'g')
      .replace(/[ıI]/g, 'i')
      .replace(/[öÖ]/g, 'o')
      .replace(/[şŞ]/g, 's')
      .replace(/[üÜ]/g, 'u')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now();
  }

  // Update existing blog post
  async updatePost(id, postData) {
    try {
      console.log('Updating post:', id, 'with data:', postData);
      
      const response = await this.request(`/blog?id=${id}`, {
        method: 'PUT',
        body: postData
      });
      console.log('Update post response:', response);
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Update post error:', error);
      return { success: false, error: error.message };
    }
  }

  async deletePost(id) {
    const response = await this.request(`/blog?id=${id}`, {
      method: 'DELETE'
    });
    if (!response.success) throw new Error(response.message || 'Blog yazısı silinemedi');
    return response;
  }

  // 🔹 Generic HTTP methods
  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // 🔹 Blog extra endpoints
  async incrementPostView(postId) {
    return this.request(`/blog?id=${postId}&action=view`, { method: 'POST' });
  }

  async getRelatedPosts(postId, language = 'tr') {
    return this.request(`/blog?id=${postId}&action=related&language=${language}`);
  }

  async likePost(postId) {
    return this.request(`/blog?id=${postId}&action=like`, { method: 'POST' });
  }

  async getCategories() {
    return this.request('/categories');
  }
}

// Singleton instance
const apiClient = new ApiClient();
export default apiClient;
