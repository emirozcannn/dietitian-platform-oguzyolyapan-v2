import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const PackageManager = ({ isEnglish }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    title_tr: '',
    title_en: '',
    description_tr: '',
    description_en: '',
    price: '',
    duration_tr: '',
    duration_en: '',
    icon: 'bi-heart',
    is_popular: false,
    features_tr: [],
    features_en: [],
    image_url: '',
    is_active: true
  });

  // Available icons
  const availableIcons = [
    { value: 'bi-heart', label: 'Kalp', preview: '♥️' },
    { value: 'bi-star', label: 'Yıldız', preview: '⭐' },
    { value: 'bi-gem', label: 'Elmas', preview: '💎' },
    { value: 'bi-trophy', label: 'Kupa', preview: '🏆' },
    { value: 'bi-shield', label: 'Kalkan', preview: '🛡️' },
    { value: 'bi-crown', label: 'Taç', preview: '👑' },
    { value: 'bi-fire', label: 'Ateş', preview: '🔥' },
    { value: 'bi-lightning', label: 'Yıldırım', preview: '⚡' },
    { value: 'bi-sun', label: 'Güneş', preview: '☀️' },
    { value: 'bi-moon', label: 'Ay', preview: '🌙' },
    { value: 'bi-flower1', label: 'Çiçek', preview: '🌸' },
    { value: 'bi-tree', label: 'Ağaç', preview: '🌳' }
  ];

  // Fetch packages from database
  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle features input (convert string to array)
  const handleFeaturesChange = (e, language) => {
    const { value } = e.target;
    const features = value.split('\n').filter(item => item.trim() !== '');
    setFormData(prev => ({
      ...prev,
      [`features_${language}`]: features
    }));
  };

  // Open modal for new package
  const openNewPackageModal = () => {
    setEditingPackage(null);
    setFormData({
      title_tr: '',
      title_en: '',
      description_tr: '',
      description_en: '',
      price: '',
      duration_tr: '',
      duration_en: '',
      icon: 'bi-heart',
      is_popular: false,
      features_tr: [],
      features_en: [],
      image_url: '',
      is_active: true
    });
    setShowModal(true);
  };

  // Open modal for editing package
  const openEditPackageModal = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title_tr: pkg.title_tr || '',
      title_en: pkg.title_en || '',
      description_tr: pkg.description_tr || '',
      description_en: pkg.description_en || '',
      price: pkg.price || '',
      duration_tr: pkg.duration_tr || '',
      duration_en: pkg.duration_en || '',
      icon: pkg.icon || 'bi-heart',
      is_popular: pkg.is_popular || false,
      features_tr: pkg.features_tr || [],
      features_en: pkg.features_en || [],
      image_url: pkg.image_url || '',
      is_active: pkg.is_active
    });
    setShowModal(true);
  };

  // Save package (create or update)
  const savePackage = async (e) => {
    e.preventDefault();
    
    try {
      const packageData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingPackage) {
        // Update existing package
        const { error } = await supabase
          .from('packages')
          .update(packageData)
          .eq('id', editingPackage.id);

        if (error) throw error;
      } else {
        // Create new package
        const { error } = await supabase
          .from('packages')
          .insert([packageData]);

        if (error) throw error;
      }

      setShowModal(false);
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Hata: ' + error.message);
    }
  };

  // Delete package
  const deletePackage = async (id) => {
    if (!confirm(isEnglish ? 'Are you sure you want to delete this package?' : 'Bu paketi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Hata: ' + error.message);
    }
  };

  // Toggle package status
  const togglePackageStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchPackages();
    } catch (error) {
      console.error('Error updating package status:', error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEnglish ? 'Package Management' : 'Paket Yönetimi'}</h2>
        <button className="btn btn-primary" onClick={openNewPackageModal}>
          <i className="bi bi-plus-circle me-2"></i>
          {isEnglish ? 'Add New Package' : 'Yeni Paket Ekle'}
        </button>
      </div>

      {/* Packages Table */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>{isEnglish ? 'Icon' : 'İkon'}</th>
              <th>{isEnglish ? 'Title (TR)' : 'Başlık (TR)'}</th>
              <th>{isEnglish ? 'Title (EN)' : 'Başlık (EN)'}</th>
              <th>{isEnglish ? 'Price' : 'Fiyat'}</th>
              <th>{isEnglish ? 'Duration' : 'Süre'}</th>
              <th>{isEnglish ? 'Popular' : 'Popüler'}</th>
              <th>{isEnglish ? 'Status' : 'Durum'}</th>
              <th>{isEnglish ? 'Actions' : 'İşlemler'}</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td>{pkg.id}</td>
                <td>
                  <i className={`${pkg.icon || 'bi-heart'} text-primary`} style={{ fontSize: '1.2rem' }}></i>
                </td>
                <td>{pkg.title_tr}</td>
                <td>{pkg.title_en}</td>
                <td>{pkg.price} ₺</td>
                <td>
                  <span className="badge bg-info">
                    {pkg.duration_tr || '1 Ay'} / {pkg.duration_en || '1 Month'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${pkg.is_popular ? 'bg-warning' : 'bg-secondary'}`}>
                    {pkg.is_popular ? (isEnglish ? 'Popular' : 'Popüler') : (isEnglish ? 'Normal' : 'Normal')}
                  </span>
                </td>
                <td>
                  <span className={`badge ${pkg.is_active ? 'bg-success' : 'bg-secondary'}`}>
                    {pkg.is_active ? (isEnglish ? 'Active' : 'Aktif') : (isEnglish ? 'Inactive' : 'Pasif')}
                  </span>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openEditPackageModal(pkg)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className={`btn btn-sm ${pkg.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                      onClick={() => togglePackageStatus(pkg.id, pkg.is_active)}
                    >
                      <i className={`bi ${pkg.is_active ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deletePackage(pkg.id)}
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

      {/* Modal for Add/Edit Package */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPackage 
                    ? (isEnglish ? 'Edit Package' : 'Paket Düzenle') 
                    : (isEnglish ? 'Add New Package' : 'Yeni Paket Ekle')
                  }
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={savePackage}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Title (Turkish)' : 'Başlık (Türkçe)'}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title_tr"
                          value={formData.title_tr}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Title (English)' : 'Başlık (İngilizce)'}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title_en"
                          value={formData.title_en}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Description (Turkish)' : 'Açıklama (Türkçe)'}</label>
                        <textarea
                          className="form-control"
                          name="description_tr"
                          rows="3"
                          value={formData.description_tr}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Description (English)' : 'Açıklama (İngilizce)'}</label>
                        <textarea
                          className="form-control"
                          name="description_en"
                          rows="3"
                          value={formData.description_en}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Features (Turkish)' : 'Özellikler (Türkçe)'}</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={formData.features_tr.join('\n')}
                          onChange={(e) => handleFeaturesChange(e, 'tr')}
                          placeholder={isEnglish ? 'One feature per line' : 'Her satıra bir özellik yazın'}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Features (English)' : 'Özellikler (İngilizce)'}</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={formData.features_en.join('\n')}
                          onChange={(e) => handleFeaturesChange(e, 'en')}
                          placeholder={isEnglish ? 'One feature per line' : 'Her satıra bir özellik yazın'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Price (₺)' : 'Fiyat (₺)'}</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Duration (Turkish)' : 'Süre (Türkçe)'}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="duration_tr"
                          value={formData.duration_tr}
                          onChange={handleInputChange}
                          placeholder="örn: 1 Ay"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Duration (English)' : 'Süre (İngilizce)'}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="duration_en"
                          value={formData.duration_en}
                          onChange={handleInputChange}
                          placeholder="e.g: 1 Month"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Icon' : 'İkon'}</label>
                        <select
                          className="form-select"
                          name="icon"
                          value={formData.icon}
                          onChange={handleInputChange}
                        >
                          {availableIcons.map(icon => (
                            <option key={icon.value} value={icon.value}>
                              {icon.preview} {icon.label}
                            </option>
                          ))}
                        </select>
                        <div className="form-text">
                          <i className={`${formData.icon} text-primary`} style={{ fontSize: '1.5rem' }}></i>
                          <span className="ms-2">{isEnglish ? 'Preview' : 'Önizleme'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">{isEnglish ? 'Image URL' : 'Görsel URL'}</label>
                        <input
                          type="url"
                          className="form-control"
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="is_popular"
                            name="is_popular"
                            checked={formData.is_popular}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="is_popular">
                            {isEnglish ? 'Popular Package' : 'Popüler Paket'}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                          />
                          <label className="form-check-label" htmlFor="is_active">
                            {isEnglish ? 'Active Package' : 'Aktif Paket'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    {isEnglish ? 'Cancel' : 'İptal'}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEnglish ? 'Save' : 'Kaydet'}
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

export default PackageManager;
