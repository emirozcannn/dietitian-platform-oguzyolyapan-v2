import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const FAQManager = () => {
  const [faqItems, setFaqItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('items');
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // FAQ Item Form State
  const [itemForm, setItemForm] = useState({
    category_id: '',
    question_tr: '',
    question_en: '',
    answer_tr: '',
    answer_en: '',
    order_index: 0,
    is_active: true
  });

  // FAQ Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name_tr: '',
    name_en: '',
    icon: 'bi-question-circle',
    color: '#0d6efd',
    order_index: 0,
    is_active: true
  });

  useEffect(() => {
    loadFAQData();
  }, []);

  const loadFAQData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load FAQ items with categories
      const { data: itemsData, error: itemsError } = await supabase
        .from('faq_items')
        .select(`
          *,
          faq_categories (
            id,
            name_tr,
            name_en,
            icon,
            color
          )
        `)
        .order('order_index');

      if (itemsError) throw itemsError;

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('faq_categories')
        .select('*')
        .order('order_index');

      if (categoriesError) throw categoriesError;

      setFaqItems(itemsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading FAQ data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // FAQ Item CRUD Operations
  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('faq_items')
          .update(itemForm)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('faq_items')
          .insert([itemForm]);

        if (error) throw error;
      }

      setShowItemModal(false);
      setEditingItem(null);
      resetItemForm();
      loadFAQData();
    } catch (error) {
      console.error('Error saving FAQ item:', error);
      setError(error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Bu FAQ öğesini silmek istediğinizden emin misiniz?')) {
      try {
        const { error } = await supabase
          .from('faq_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
        loadFAQData();
      } catch (error) {
        console.error('Error deleting FAQ item:', error);
        setError(error.message);
      }
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      category_id: item.category_id || '',
      question_tr: item.question_tr || '',
      question_en: item.question_en || '',
      answer_tr: item.answer_tr || '',
      answer_en: item.answer_en || '',
      order_index: item.order_index || 0,
      is_active: item.is_active
    });
    setShowItemModal(true);
  };

  const resetItemForm = () => {
    setItemForm({
      category_id: '',
      question_tr: '',
      question_en: '',
      answer_tr: '',
      answer_en: '',
      order_index: 0,
      is_active: true
    });
  };

  // FAQ Category CRUD Operations
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('faq_categories')
          .update(categoryForm)
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('faq_categories')
          .insert([categoryForm]);

        if (error) throw error;
      }

      setShowCategoryModal(false);
      setEditingCategory(null);
      resetCategoryForm();
      loadFAQData();
    } catch (error) {
      console.error('Error saving FAQ category:', error);
      setError(error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu kategoriye bağlı tüm FAQ öğeleri etkilenecek.')) {
      try {
        const { error } = await supabase
          .from('faq_categories')
          .delete()
          .eq('id', id);

        if (error) throw error;
        loadFAQData();
      } catch (error) {
        console.error('Error deleting FAQ category:', error);
        setError(error.message);
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name_tr: category.name_tr || '',
      name_en: category.name_en || '',
      icon: category.icon || 'bi-question-circle',
      color: category.color || '#0d6efd',
      order_index: category.order_index || 0,
      is_active: category.is_active
    });
    setShowCategoryModal(true);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name_tr: '',
      name_en: '',
      icon: 'bi-question-circle',
      color: '#0d6efd',
      order_index: 0,
      is_active: true
    });
  };

  const toggleItemStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('faq_items')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadFAQData();
    } catch (error) {
      console.error('Error toggling FAQ item status:', error);
      setError(error.message);
    }
  };

  const toggleCategoryStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('faq_categories')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadFAQData();
    } catch (error) {
      console.error('Error toggling FAQ category status:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
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
            <h2>
              <i className="bi bi-question-circle me-2"></i>
              FAQ Yönetimi
            </h2>
            <div className="btn-group">
              <button
                className={`btn ${activeTab === 'items' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('items')}
              >
                <i className="bi bi-list-ul me-2"></i>
                FAQ Öğeleri
              </button>
              <button
                className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('categories')}
              >
                <i className="bi bi-folder me-2"></i>
                Kategoriler
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* FAQ Items Tab */}
          {activeTab === 'items' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">FAQ Öğeleri ({faqItems.length})</h5>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingItem(null);
                    resetItemForm();
                    setShowItemModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Yeni FAQ Ekle
                </button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Sıra</th>
                        <th>Kategori</th>
                        <th>Soru (TR)</th>
                        <th>Soru (EN)</th>
                        <th>Görüntülenme</th>
                        <th>Durumu</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faqItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.order_index}</td>
                          <td>
                            {item.faq_categories && (
                              <span 
                                className="badge"
                                style={{ backgroundColor: item.faq_categories.color, color: 'white' }}
                              >
                                <i className={`bi ${item.faq_categories.icon} me-1`}></i>
                                {item.faq_categories.name_tr}
                              </span>
                            )}
                          </td>
                          <td className="text-truncate" style={{ maxWidth: '200px' }}>
                            {item.question_tr}
                          </td>
                          <td className="text-truncate" style={{ maxWidth: '200px' }}>
                            {item.question_en}
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {item.view_count || 0}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`btn btn-sm ${item.is_active ? 'btn-success' : 'btn-secondary'}`}
                              onClick={() => toggleItemStatus(item.id, item.is_active)}
                            >
                              {item.is_active ? 'Aktif' : 'Pasif'}
                            </button>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEditItem(item)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Categories Tab */}
          {activeTab === 'categories' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">FAQ Kategorileri ({categories.length})</h5>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingCategory(null);
                    resetCategoryForm();
                    setShowCategoryModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Yeni Kategori Ekle
                </button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Sıra</th>
                        <th>Kategori</th>
                        <th>İsim (TR)</th>
                        <th>İsim (EN)</th>
                        <th>Renk</th>
                        <th>Durumu</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td>{category.order_index}</td>
                          <td>
                            <span 
                              className="badge"
                              style={{ backgroundColor: category.color, color: 'white' }}
                            >
                              <i className={`bi ${category.icon} me-1`}></i>
                              {category.name_tr}
                            </span>
                          </td>
                          <td>{category.name_tr}</td>
                          <td>{category.name_en}</td>
                          <td>
                            <div
                              className="color-preview"
                              style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: category.color,
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                display: 'inline-block'
                              }}
                            ></div>
                            <span className="ms-2">{category.color}</span>
                          </td>
                          <td>
                            <button
                              className={`btn btn-sm ${category.is_active ? 'btn-success' : 'btn-secondary'}`}
                              onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                            >
                              {category.is_active ? 'Aktif' : 'Pasif'}
                            </button>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEditCategory(category)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Item Modal */}
      {showItemModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingItem ? 'FAQ Öğesi Düzenle' : 'Yeni FAQ Öğesi Ekle'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowItemModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveItem}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Kategori</label>
                        <select
                          className="form-select"
                          value={itemForm.category_id}
                          onChange={(e) => setItemForm({...itemForm, category_id: e.target.value})}
                          required
                        >
                          <option value="">Kategori Seçin</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name_tr}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Sıra</label>
                        <input
                          type="number"
                          className="form-control"
                          value={itemForm.order_index}
                          onChange={(e) => setItemForm({...itemForm, order_index: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Soru (Türkçe)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={itemForm.question_tr}
                      onChange={(e) => setItemForm({...itemForm, question_tr: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Soru (İngilizce)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={itemForm.question_en}
                      onChange={(e) => setItemForm({...itemForm, question_en: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Cevap (Türkçe)</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={itemForm.answer_tr}
                      onChange={(e) => setItemForm({...itemForm, answer_tr: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Cevap (İngilizce)</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={itemForm.answer_en}
                      onChange={(e) => setItemForm({...itemForm, answer_en: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="itemActive"
                      checked={itemForm.is_active}
                      onChange={(e) => setItemForm({...itemForm, is_active: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="itemActive">
                      Aktif
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowItemModal(false)}>
                    İptal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Category Modal */}
      {showCategoryModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCategoryModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveCategory}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">İsim (Türkçe)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={categoryForm.name_tr}
                          onChange={(e) => setCategoryForm({...categoryForm, name_tr: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">İsim (İngilizce)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={categoryForm.name_en}
                          onChange={(e) => setCategoryForm({...categoryForm, name_en: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">İkon (Bootstrap Icons)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={categoryForm.icon}
                          onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                          placeholder="bi-question-circle"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Renk</label>
                        <input
                          type="color"
                          className="form-control form-control-color"
                          value={categoryForm.color}
                          onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Sıra</label>
                    <input
                      type="number"
                      className="form-control"
                      value={categoryForm.order_index}
                      onChange={(e) => setCategoryForm({...categoryForm, order_index: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="categoryActive"
                      checked={categoryForm.is_active}
                      onChange={(e) => setCategoryForm({...categoryForm, is_active: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="categoryActive">
                      Aktif
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>
                    İptal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Güncelle' : 'Ekle'}
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

export default FAQManager;
