// Frontend API client - tarayıcıda çalışır, jsonwebtoken kullanmaz

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // body objesi varsa JSON.stringify yap
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'API endpoint bulunamadı' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  }

  // 🔹 Auth endpoints
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

  // 🔹 Packages endpoints
  async getPackages(language = 'tr') {
    return this.request(`/packages?language=${language}`);
  }

  async getPopularPackages(language = 'tr') {
    return this.request(`/packages/popular?language=${language}`);
  }

  // 🔹 Testimonials endpoints
  async getApprovedTestimonials(language = 'tr', limit = null) {
    const params = new URLSearchParams({ language });
    if (limit) params.append('limit', limit);
    return this.request(`/testimonials/approved?${params}`);
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
    const response = await this.request('/blog', {
      method: 'POST',
      body: postData
    });
    if (!response.success) throw new Error(response.message || 'Blog yazısı oluşturulamadı');
    return response;
  }

  async updatePost(id, postData) {
    const response = await this.request(`/blog/${id}`, {
      method: 'PUT',
      body: postData
    });
    if (!response.success) throw new Error(response.message || 'Blog yazısı güncellenemedi');
    return response;
  }

  async deletePost(id) {
    const response = await this.request(`/blog/${id}`, {
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
    return this.request(`/blog/${postId}/view`, { method: 'POST' });
  }

  async getRelatedPosts(postId, language = 'tr') {
    return this.request(`/blog/${postId}/related?language=${language}`);
  }

  async likePost(postId) {
    return this.request(`/blog/${postId}/like`, { method: 'POST' });
  }

  async getCategories() {
    return this.request('/categories');
  }
}

// Singleton instance
const apiClient = new ApiClient();
export default apiClient;
