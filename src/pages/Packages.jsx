import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';

const Packages = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddedMessage, setShowAddedMessage] = useState(null);

  // Veritabanından paketleri çek
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching packages:', error);
          setPackages([]);
        } else {
          setPackages(data || []);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Veritabanı verilerini arayüze uygun şekilde dönüştür
  const displayPackages = packages.map(pkg => ({
    id: pkg.id,
    name: isEnglish ? pkg.title_en : pkg.title_tr,
    price: pkg.price.toString(),
    duration: isEnglish ? (pkg.duration_en || '1 Month') : (pkg.duration_tr || '1 Ay'),
    popular: pkg.is_popular || false,
    shortDescription: isEnglish ? pkg.description_en : pkg.description_tr,
    features: isEnglish ? pkg.features_en : pkg.features_tr,
    color: pkg.is_popular ? 'success' : (pkg.id === 1 ? 'primary' : 'info'),
    icon: pkg.icon || 'bi-heart'
  }));

  // Supabase başarısız olursa yedek paketler
  const fallbackPackages = [
    {
      id: 1,
      name: isEnglish ? 'Basic Package' : 'Temel Paket',
      price: '299',
      duration: isEnglish ? '1 Month' : '1 Ay',
      popular: false,
      shortDescription: isEnglish ?
        'Perfect for beginners starting their nutrition journey' :
        'Beslenme yolculuğuna başlayanlar için mükemmel',
      features: isEnglish ? [
        'Initial consultation (60 min)',
        'Personalized meal plan',
        'Weekly check-ins',
        'WhatsApp support',
        'Basic recipes collection'
      ] : [
        'İlk konsültasyon (60 dk)',
        'Kişiselleştirilmiş beslenme planı',
        'Haftalık takip',
        'WhatsApp desteği',
        'Temel tarif koleksiyonu'
      ],
      color: 'primary',
      icon: 'bi-heart'
    },
    {
      id: 2,
      name: isEnglish ? 'Premium Package' : 'Premium Paket',
      price: '599',
      duration: isEnglish ? '3 Months' : '3 Ay',
      popular: true,
      shortDescription: isEnglish ?
        'Most comprehensive package for sustainable results' :
        'Sürdürülebilir sonuçlar için en kapsamlı paket',
      features: isEnglish ? [
        'Extended consultation (90 min)',
        'Comprehensive meal plan',
        'Daily check-ins',
        'Priority WhatsApp support',
        'Recipe collection + meal prep guide',
        'Supplement recommendations',
        'Progress tracking tools'
      ] : [
        'Uzun konsültasyon (90 dk)',
        'Kapsamlı beslenme planı',
        'Günlük takip',
        'Öncelikli WhatsApp desteği',
        'Tarif koleksiyonu + meal prep rehberi',
        'Supplement önerileri',
        'İlerleme takip araçları'
      ],
      color: 'success',
      icon: 'bi-star'
    },
    {
      id: 3,
      name: isEnglish ? 'VIP Package' : 'VIP Paket',
      price: '1199',
      duration: isEnglish ? '6 Months' : '6 Ay',
      popular: false,
      shortDescription: isEnglish ?
        'Premium service with exclusive features and priority support' :
        'Özel özellikler ve öncelikli destek ile premium hizmet',
      features: isEnglish ? [
        'Complete health & lifestyle assessment',
        'Personalized nutrition & fitness program',
        'Weekly one-on-one consultations',
        'Advanced body composition tracking',
        'Priority 24/7 support',
        'Exclusive recipe collection',
        'Monthly progress reports',
        'Supplement protocol design',
        'Meal delivery coordination',
        'Family nutrition guidance'
      ] : [
        'Kapsamlı sağlık ve yaşam tarzı değerlendirmesi',
        'Kişiselleştirilmiş beslenme ve fitness programı',
        'Haftalık birebir konsültasyonlar',
        'Gelişmiş vücut kompozisyon takibi',
        'Öncelikli 7/24 destek',
        'Özel tarif koleksiyonu',
        'Aylık ilerleme raporları',
        'Takviye protokol tasarımı',
        'Yemek teslimat koordinasyonu',
        'Aile beslenme rehberliği'
      ],
      color: 'warning',
      icon: 'bi-gem'
    }
  ];

  const packagesToShow = loading ? [] : (displayPackages.length > 0 ? displayPackages : fallbackPackages);

  const handlePackageClick = (packageData) => {
    setSelectedPackage(packageData);
  };

  const handleAddToCart = (packageData) => {
    const cartItem = {
      id: packageData.id,
      name: packageData.name,
      price: parseFloat(packageData.price),
      duration: packageData.duration,
      description: packageData.description,
      features: packageData.features
    };
    
    addToCart(cartItem);
    setShowAddedMessage(packageData.id);
    setTimeout(() => {
      setShowAddedMessage(null);
    }, 2000);
  };

  const buyNow = (packageData) => {
    handleAddToCart(packageData);
    navigate(isEnglish ? '/en/checkout' : '/odeme');
  };

  return (
    <>
      <Helmet>
        <title>{t('packages.title')} - Oğuz Yolyapan</title>
        <meta name="description" content={t('packages.subtitle')} />
      </Helmet>

      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-4 fw-bold mb-4">{t('packages.title')}</h1>
            <p className="lead text-muted mb-4">{t('packages.subtitle')}</p>
          </div>
        </div>

        <div className="row">
          {!loading && packagesToShow.length === 0 && (
            <div className="col-12">
              <div className="alert alert-info mb-4">
                <i className="bi bi-info-circle me-2"></i>
                {isEnglish ? 
                  'No packages found. Showing fallback packages.' : 
                  'Paket bulunamadı. Yedek paketler gösteriliyor.'}
              </div>
            </div>
          )}

          {loading && (
            <div className="col-12">
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          )}

          {!loading && packagesToShow.map((pkg) => (
            <div key={pkg.id} className="col-lg-4 col-md-6 mb-4">
              <div
                className={`card package-card shadow-lg border-0 h-100 position-relative ${pkg.popular ? 'popular' : ''}`}
                onClick={() => handlePackageClick(pkg)}
              >
                {pkg.popular && (
                  <div className="position-absolute top-0 start-50 translate-middle">
                    <span className="badge bg-success px-3 py-2 rounded-pill">
                      <i className="bi bi-star-fill me-1"></i>
                      {t('packages.popular')}
                    </span>
                  </div>
                )}

                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <i className={`${pkg.icon} text-${pkg.color}`} style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="card-title mb-3">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="h2 fw-bold text-primary">₺{pkg.price}</span>
                    <span className="text-muted">/{pkg.duration}</span>
                  </div>
                  <p className="text-muted mb-4">{pkg.shortDescription}</p>
                  <ul className="list-unstyled mb-4">
                    {pkg.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li className="text-muted">
                        <i className="bi bi-plus-circle me-2"></i>
                        {isEnglish ? `+${pkg.features.length - 3} more features` : `+${pkg.features.length - 3} özellik daha`}
                      </li>
                    )}
                  </ul>

                  <div className="d-grid gap-2">
                    <button
                      className={`btn btn-${pkg.color} btn-lg px-4`}
                      onClick={() => buyNow(pkg)}
                    >
                      <i className="bi bi-credit-card me-2"></i>
                      {isEnglish ? 'Buy Now' : 'Hemen Satın Al'}
                    </button>

                    <button
                      className={`btn btn-outline-${pkg.color} px-4`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(pkg);
                      }}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      {showAddedMessage === pkg.id ?
                        (isEnglish ? 'Added!' : 'Eklendi!') :
                        (isEnglish ? 'Add to Cart' : 'Sepete Ekle')}
                    </button>

                    <button
                      className="btn btn-link text-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePackageClick(pkg);
                      }}
                    >
                      <i className="bi bi-info-circle me-1"></i>
                      {isEnglish ? 'View Details' : 'Detayları Gör'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paket Detay Modal */}
        {selectedPackage && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center">
                    <i className={`${selectedPackage.icon} text-${selectedPackage.color} me-2`}></i>
                    {selectedPackage.name}
                    {selectedPackage.popular && (
                      <span className="badge bg-success ms-2">
                        <i className="bi bi-star-fill me-1"></i>
                        {t('packages.popular')}
                      </span>
                    )}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedPackage(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-4 text-center mb-4">
                      <div className="p-4 bg-light rounded">
                        <i className={`${selectedPackage.icon} text-${selectedPackage.color} mb-3`} style={{ fontSize: '3rem' }}></i>
                        <h4 className="fw-bold text-primary">₺{selectedPackage.price}</h4>
                        <p className="text-muted">{selectedPackage.duration}</p>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h6 className="mb-3">{isEnglish ? 'Package Features:' : 'Paket Özellikleri:'}</h6>
                      <ul className="list-unstyled">
                        {selectedPackage.features.map((feature, idx) => (
                          <li key={idx} className="mb-2">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-light rounded">
                    <p className="mb-0 text-muted">
                      <i className="bi bi-info-circle me-2"></i>
                      {selectedPackage.shortDescription}
                    </p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedPackage(null)}>
                    {isEnglish ? 'Close' : 'Kapat'}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-${selectedPackage.color} me-2`}
                    onClick={() => {
                      addToCart(selectedPackage);
                      setSelectedPackage(null);
                    }}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    {isEnglish ? 'Add to Cart' : 'Sepete Ekle'}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-${selectedPackage.color}`}
                    onClick={() => {
                      buyNow(selectedPackage);
                      setSelectedPackage(null);
                    }}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    {isEnglish ? 'Buy Now' : 'Hemen Satın Al'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Packages;
