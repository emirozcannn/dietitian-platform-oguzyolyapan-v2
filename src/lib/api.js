// Frontend API client - tarayıcıda çalışır, jsonwebtoken kullanmaz

const API_BASE_URL = 'http://localhost:3000/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  async getProfile(userId) {
    return this.request(`/auth/profile/${userId}`);
  }

  // Packages endpoints
  async getPackages(language = 'tr') {
    return this.request(`/packages?language=${language}`);
  }

  async getPopularPackages(language = 'tr') {
    return this.request(`/packages/popular?language=${language}`);
  }

  // Testimonials endpoints
  async getApprovedTestimonials(language = 'tr', limit = null) {
    const params = new URLSearchParams({ language });
    if (limit) params.append('limit', limit);
    return this.request(`/testimonials/approved?${params}`);
  }

  // Blog endpoints
  async getAllPosts(language = 'tr', limit = null, categories = null, status = 'all') {
    try {
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
    } catch (error) {
      console.error('API Error - getAllPosts:', error);
      throw error;
    }
  }

  async getPublishedPosts(language = 'tr', limit = null, categories = null) {
    const params = new URLSearchParams({
      language,
      ...(limit && { limit }),
      ...(categories && { categories })
    });
    
    return this.request(`/blog/published?${params}`);
  }

  async getFeaturedPosts(language = 'tr', limit = 3) {
    return this.request(`/blog/featured?language=${language}&limit=${limit}`);
  }

  async getPopularPosts(language = 'tr', limit = 5) {
    return this.request(`/blog/popular?language=${language}&limit=${limit}`);
  }

  async getPostBySlug(slug, language = 'tr') {
    return this.request(`/blog/post/${slug}?language=${language}`);
  }

  async getPostById(id) {
    return this.request(`/blog/${id}`);
  }

  async createPost(postData) {
    try {
      const response = await this.request('/blog', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Blog yazısı oluşturulamadı');
      }
      
      return response;
    } catch (error) {
      console.error('API Error - createPost:', error);
      throw error;
    }
  }

  async updatePost(id, postData) {
    try {
      const response = await this.request(`/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData)
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Blog yazısı güncellenemedi');
      }
      
      return response;
    } catch (error) {
      console.error('API Error - updatePost:', error);
      throw error;
    }
  }

  async deletePost(id) {
    try {
      const response = await this.request(`/blog/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Blog yazısı silinemedi');
      }
      
      return response;
    } catch (error) {
      console.error('API Error - deletePost:', error);
      throw error;
    }
  }

  async incrementPostView(id) {
    return this.request(`/blog/${id}/view`, {
      method: 'POST'
    });
  }

  async getRelatedPosts(id, language = 'tr') {
    return this.request(`/blog/${id}/related?language=${language}`);
  }

  async likePost(id) {
    return this.request(`/blog/${id}/like`, {
      method: 'POST'
    });
  }

  // Categories API
  async getCategories(language = 'tr') {
    try {
      const response = await this.request(`/categories?language=${language}`);
      
      if (!response.success) {
        console.warn('Categories API failed, using fallback');
        return {
          success: true,
          data: [
            {
              _id: '1',
              name: { tr: 'Genel Beslenme', en: 'General Nutrition' },
              color: '#28a745',
              icon: 'leaf'
            }
          ]
        };
      }
      
      return response;
    } catch (error) {
      console.error('API Error - getCategories:', error);
      // Return fallback data instead of throwing
      return {
        success: true,
        data: [
          {
            _id: '1',
            name: { tr: 'Genel Beslenme', en: 'General Nutrition' },
            color: '#28a745',
            icon: 'leaf'
          }
        ]
      };
    }
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: categoryData
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: categoryData
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE'
    });
  }
}

// Singleton instance
const apiClient = new ApiClient();

export default apiClient;