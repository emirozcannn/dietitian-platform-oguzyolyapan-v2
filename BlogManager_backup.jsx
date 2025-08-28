import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../lib/api.js';
import { useTranslation } from 'react-i18next';
import MDEditor from '@uiw/react-md-editor';

const BlogManager = () => {
  const { i18n } = useTranslation();
  
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title_tr: '',
    title_en: '',
    slug_tr: '',
    slug_en: '',
    content_tr: '',
    content_en: '',
    excerpt_tr: '',
    excerpt_en: '',
    image_url: '',
    image_alt_text: '',
    category_id: '',
    tags_tr: [],
    tags_en: [],
    meta_title_tr: '',
    meta_title_en: '',
    meta_description_tr: '',
    meta_description_en: '',
    meta_keywords_tr: '',
    meta_keywords_en: '',
    status: 'draft',
    is_featured: false,
    published_at: '',
    scheduled_at: '',
    author_name: 'Oğuz Yolyapan',
    author_bio_tr: '',
    author_bio_en: '',
    author_image: '',
    read_time: 5
  });

  // Load functions
  const loadPosts = useCallback(async () => {
    try {
      const response = await apiClient.getAllPosts('tr', null, null, filterStatus);
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const loadCategories = async () => {
    try {
      const response = await apiClient.getBlogCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await apiClient.getBlogTags('tr');
      setTags(response.data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  // Load data
  useEffect(() => {
    loadPosts();
    loadCategories();
    loadTags();
  }, [loadPosts]);

  // Image upload function (TODO: MongoDB/Cloudinary entegrasyonu)
  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      
      // Şimdilik placeholder - gelecekte Cloudinary/AWS S3 entegrasyonu yapılacak
      const placeholderUrl = `https://via.placeholder.com/800x400?text=${encodeURIComponent(file.name)}`;
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        image_url: placeholderUrl
      }));

      console.log('Image upload placeholder:', placeholderUrl);
      return placeholderUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Resim yükleme hatası: ' + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
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
      .trim();
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug when title changes
      if (name === 'title_tr' && value) {
        setFormData(prev => ({ ...prev, slug_tr: generateSlug(value) }));
      } else if (name === 'title_en' && value) {
        setFormData(prev => ({ ...prev, slug_en: generateSlug(value) }));
      }
    }
  };

  // Handle tag selection
  const handleTagChange = (tagId, language) => {
    const tagKey = `tags_${language}`;
    const currentTags = formData[tagKey] || [];
    
    if (currentTags.includes(tagId)) {
      setFormData(prev => ({
        ...prev,
        [tagKey]: currentTags.filter(id => id !== tagId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [tagKey]: [...currentTags, tagId]
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title_tr: '',
      title_en: '',
      slug_tr: '',
      slug_en: '',
      content_tr: '',
      content_en: '',
      excerpt_tr: '',
      excerpt_en: '',
      featured_image: '',
      thumbnail: '',
      image_alt_tr: '',
      image_alt_en: '',
      category_id: '',
      tags_tr: [],
      tags_en: [],
      meta_title_tr: '',
      meta_title_en: '',
      meta_description_tr: '',
      meta_description_en: '',
      meta_keywords_tr: '',
      meta_keywords_en: '',
      status: 'draft',
      is_featured: false,
      published_at: '',
      scheduled_at: '',
      author_name: 'Oğuz Yolyapan',
      author_bio_tr: '',
      author_bio_en: '',
      author_image: '',
      read_time: 5
    });
    setEditingPost(null);
  };

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        tags_tr: formData.tags_tr || [],
        tags_en: formData.tags_en || [],
        published_at: formData.published_at ? new Date(formData.published_at).toISOString() : null,
        scheduled_at: formData.scheduled_at ? new Date(formData.scheduled_at).toISOString() : null,
        updated_at: new Date().toISOString()
      };

      if (editingPost) {
        // Update existing post
        await apiClient.updatePost(editingPost._id, submitData);
        console.log('Post updated successfully!');
      } else {
        // Create new post
        await apiClient.createPost(submitData);
        console.log('Post created successfully!');
      }

      setShowModal(false);
      resetForm();
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title_tr: post.title_tr || '',
      title_en: post.title_en || '',
      slug_tr: post.slug_tr || '',
      slug_en: post.slug_en || '',
      content_tr: post.content_tr || '',
      content_en: post.content_en || '',
      excerpt_tr: post.excerpt_tr || '',
      excerpt_en: post.excerpt_en || '',
      featured_image: post.featured_image || '',
      thumbnail: post.thumbnail || '',
      image_alt_tr: post.image_alt_tr || '',
      image_alt_en: post.image_alt_en || '',
      category_id: post.category_id || '',
      tags_tr: Array.isArray(post.tags_tr) ? post.tags_tr : (post.tags_tr ? JSON.parse(post.tags_tr) : []),
      tags_en: Array.isArray(post.tags_en) ? post.tags_en : (post.tags_en ? JSON.parse(post.tags_en) : []),
      meta_title_tr: post.meta_title_tr || '',
      meta_title_en: post.meta_title_en || '',
      meta_description_tr: post.meta_description_tr || '',
      meta_description_en: post.meta_description_en || '',
      meta_keywords_tr: post.meta_keywords_tr || '',
      meta_keywords_en: post.meta_keywords_en || '',
      status: post.status || 'draft',
      is_featured: post.is_featured || false,
      published_at: post.published_at || '',
      scheduled_at: post.scheduled_at || '',
      author_name: post.author_name || 'Oğuz Yolyapan',
      author_bio_tr: post.author_bio_tr || '',
      author_bio_en: post.author_bio_en || '',
      author_image: post.author_image || '',
      read_time: post.read_time || 5
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await apiClient.deletePost(postId);
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post: ' + error.message);
    }
  };

  // Toggle feature status
  const toggleFeatured = async (postId, currentStatus) => {
    try {
      await apiClient.updatePost(postId, { 
        is_featured: !currentStatus, 
        updated_at: new Date().toISOString() 
      });
      loadPosts();
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  // Toggle publish status
  const togglePublish = async (postId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'published') {
        updateData.published_at = new Date().toISOString();
      }

      await apiClient.updatePost(postId, updateData);
      loadPosts();
    } catch (error) {
      console.error('Error updating publish status:', error);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesSearch = !searchTerm || 
      post.title_tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.title_en.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'published': return 'bg-success';
      case 'draft': return 'bg-secondary';
      case 'scheduled': return 'bg-info';
      case 'archived': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0">
              <i className="bi bi-journal-text me-2"></i>
              Blog Yazıları
            </h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Yeni Yazı
            </button>
          </div>

          {/* Filters */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Tüm Durumlar</option>
                    <option value="published">Yayınlanmış</option>
                    <option value="draft">Taslak</option>
                    <option value="scheduled">Zamanlanmış</option>
                    <option value="archived">Arşivlenmiş</option>
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label">Arama</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Başlık ile ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Posts Table */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Görsel</th>
                      <th>Başlık</th>
                      <th>Kategori</th>
                      <th>Durum</th>
                      <th>Öne Çıkan</th>
                      <th>Görüntülenme</th>
                      <th>Beğeni</th>
                      <th>Yorum</th>
                      <th>Tarih</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map(post => (
                      <tr key={post.id}>
                        <td>
                          {post.thumbnail ? (
                            <img
                              src={post.thumbnail}
                              alt={post.image_alt_tr}
                              className="rounded"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              className="bg-light rounded d-flex align-items-center justify-content-center"
                              style={{ width: '50px', height: '50px' }}
                            >
                              <i className="bi bi-image text-muted"></i>
                            </div>
                          )}
                        </td>
                        <td>
                          <div>
                            <strong>{i18n.language === 'tr' ? post.title_tr : post.title_en}</strong>
                            <div className="text-muted small">
                              {i18n.language === 'tr' ? post.excerpt_tr : post.excerpt_en}
                            </div>
                          </div>
                        </td>
                        <td>
                          {post.categories && (
                            <span
                              className="badge"
                              style={{ backgroundColor: post.categories.color, color: 'white' }}
                            >
                              <i className={`bi ${post.categories.icon} me-1`}></i>
                              {i18n.language === 'tr' ? post.categories.name_tr : post.categories.name_en}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadge(post.status)}`}>
                            {post.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${post.is_featured ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => toggleFeatured(post.id, post.is_featured)}
                          >
                            <i className="bi bi-star"></i>
                          </button>
                        </td>
                        <td>
                          <span className="badge bg-info">{post.view_count}</span>
                        </td>
                        <td>
                          <span className="badge bg-danger">{post.like_count}</span>
                        </td>
                        <td>
                          <span className="badge bg-primary">{post.comment_count}</span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {new Date(post.created_at).toLocaleDateString('tr-TR')}
                          </small>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(post)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className={`btn btn-sm ${post.status === 'published' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                              onClick={() => togglePublish(post.id, post.status)}
                            >
                              <i className={`bi ${post.status === 'published' ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(post.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-4">
                    <i className="bi bi-journal-x display-4 text-muted"></i>
                    <p className="text-muted mt-2">Henüz blog yazısı yok.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPost ? 'Yazı Düzenle' : 'Yeni Yazı'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Basic Info */}
                    <div className="col-12">
                      <h6 className="text-primary">Temel Bilgiler</h6>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Başlık (TR) *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title_tr"
                        value={formData.title_tr}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Başlık (EN) *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title_en"
                        value={formData.title_en}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Slug (TR) *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="slug_tr"
                        value={formData.slug_tr}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Slug (EN) *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="slug_en"
                        value={formData.slug_en}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Content */}
                    <div className="col-12">
                      <h6 className="text-primary">İçerik</h6>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Özet (TR)</label>
                      <textarea
                        className="form-control"
                        name="excerpt_tr"
                        value={formData.excerpt_tr}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Özet (EN)</label>
                      <textarea
                        className="form-control"
                        name="excerpt_en"
                        value={formData.excerpt_en}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">İçerik (TR) *</label>
                      <MDEditor
                        value={formData.content_tr}
                        onChange={(value) => setFormData(prev => ({ ...prev, content_tr: value || '' }))}
                        height={300}
                        preview="edit"
                        data-color-mode="light"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">İçerik (EN) *</label>
                      <MDEditor
                        value={formData.content_en}
                        onChange={(value) => setFormData(prev => ({ ...prev, content_en: value || '' }))}
                        height={300}
                        preview="edit"
                        data-color-mode="light"
                      />
                    </div>

                    {/* Media */}
                    <div className="col-12">
                      <h6 className="text-primary">Medya</h6>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Blog Resmi</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                        disabled={uploadingImage}
                      />
                      {uploadingImage && (
                        <div className="mt-2">
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          <small className="text-muted">Resim yükleniyor...</small>
                        </div>
                      )}
                      {formData.image_url && (
                        <div className="mt-2">
                          <img 
                            src={formData.image_url} 
                            alt="Blog resmi" 
                            className="img-thumbnail"
                            style={{ height: '100px', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => setFormData(prev => ({...prev, image_url: ''}))}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Resim Alt Metni</label>
                      <input
                        type="text"
                        className="form-control"
                        name="image_alt_text"
                        value={formData.image_alt_text}
                        onChange={handleChange}
                        placeholder="Resim açıklaması (SEO için önemli)"
                      />
                    </div>

                    {/* Category and Tags */}
                    <div className="col-12">
                      <h6 className="text-primary">Kategori & Etiketler</h6>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Kategori</label>
                      <select
                        className="form-select"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                      >
                        <option value="">Kategori Seçin</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {i18n.language === 'tr' ? cat.name_tr : cat.name_en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Okuma Süresi (dakika)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="read_time"
                        value={formData.read_time}
                        onChange={handleChange}
                        min="1"
                        max="120"
                      />
                    </div>

                    {/* Tags */}
                    <div className="col-md-6">
                      <label className="form-label">Etiketler (TR)</label>
                      <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {tags.map(tag => (
                          <div key={tag.id} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={formData.tags_tr.includes(tag.id)}
                              onChange={() => handleTagChange(tag.id, 'tr')}
                            />
                            <label className="form-check-label">
                              {tag.name_tr}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Etiketler (EN)</label>
                      <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {tags.map(tag => (
                          <div key={tag.id} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={formData.tags_en.includes(tag.id)}
                              onChange={() => handleTagChange(tag.id, 'en')}
                            />
                            <label className="form-check-label">
                              {tag.name_en}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SEO */}
                    <div className="col-12">
                      <h6 className="text-primary">SEO Ayarları</h6>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Meta Başlık (TR)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="meta_title_tr"
                        value={formData.meta_title_tr}
                        onChange={handleChange}
                        maxLength="60"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Meta Başlık (EN)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="meta_title_en"
                        value={formData.meta_title_en}
                        onChange={handleChange}
                        maxLength="60"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Meta Açıklama (TR)</label>
                      <textarea
                        className="form-control"
                        name="meta_description_tr"
                        value={formData.meta_description_tr}
                        onChange={handleChange}
                        rows="2"
                        maxLength="160"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Meta Açıklama (EN)</label>
                      <textarea
                        className="form-control"
                        name="meta_description_en"
                        value={formData.meta_description_en}
                        onChange={handleChange}
                        rows="2"
                        maxLength="160"
                      />
                    </div>

                    {/* Status and Publishing */}
                    <div className="col-12">
                      <h6 className="text-primary">Yayın Ayarları</h6>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Durum</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="draft">Taslak</option>
                        <option value="published">Yayınla</option>
                        <option value="scheduled">Zamanla</option>
                        <option value="archived">Arşivle</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Yayın Tarihi</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="published_at"
                        value={formData.published_at}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Zamanlanmış Tarih</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="scheduled_at"
                        value={formData.scheduled_at}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="is_featured"
                          checked={formData.is_featured}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">
                          Öne Çıkan Yazı
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Kaydediliyor...' : (editingPost ? 'Güncelle' : 'Kaydet')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
