import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import { sendEmail } from '../lib/emailService';

const Signup = () => {
  const { t, i18n } = useTranslation();
  const auth = AuthContext.useAuth();
  const { signUp, user } = auth;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    terms: false,
    privacy: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging
  console.log('🔍 Signup Auth context:', auth);
  console.log('🔍 Available methods:', Object.keys(auth));
  console.log('🔍 signUp function:', typeof signUp, signUp);

  const isEnglish = i18n.language === 'en';

  const getLocalizedPath = useCallback((path) => {
    return isEnglish ? `/en${path}` : path;
  }, [isEnglish]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectTo = getLocalizedPath(isEnglish ? '/client-panel' : '/danisan-paneli');
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, isEnglish, getLocalizedPath]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('auth.signup.errors.firstNameRequired');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('auth.signup.errors.lastNameRequired');
    }
    
    if (!formData.email) {
      newErrors.email = t('auth.signup.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.signup.errors.emailInvalid');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('auth.signup.errors.phoneRequired');
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.signup.errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.signup.errors.passwordMinLength');
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.signup.errors.passwordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.signup.errors.passwordsNotMatch');
    }
    
    if (!formData.terms) {
      newErrors.terms = t('auth.signup.errors.termsRequired');
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('🔐 Attempting signup...');
      console.log('🔍 signUp function check:', typeof signUp, !!signUp);
      
      if (!signUp) {
        throw new Error('signUp function not available');
      }

      const metadata = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        birth_date: formData.birthDate,
        gender: formData.gender,
        full_name: `${formData.firstName} ${formData.lastName}`
      };
      
      const { data, error } = await signUp(formData.email, formData.password, metadata);
      
      if (error) {
        console.error('Signup error:', error);
        // Handle different error types
        if (error.message.includes('already registered')) {
          setErrors({ submit: t('auth.signup.errors.emailExists') });
        } else if (error.message.includes('Password should be at least 6 characters')) {
          setErrors({ submit: 'Şifre en az 6 karakter olmalıdır.' });
        } else {
          setErrors({ submit: error.message });
        }
        return;
      }
      
      if (data?.user) {
        // Send welcome email
        try {
          await sendEmail({
            to: formData.email,
            subject: isEnglish ? 'Welcome to Oğuz Yolyapan!' : 'Oğuz Yolyapan\'a Hoş Geldiniz!',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #28a745; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="margin: 0; font-size: 28px;">${isEnglish ? 'Welcome!' : 'Hoş Geldiniz!'}</h1>
                  <p style="margin: 10px 0 0 0; font-size: 16px;">${formData.firstName} ${formData.lastName}</p>
                </div>
                <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #333; margin-top: 0;">${isEnglish ? 'Account Created Successfully!' : 'Hesabınız Başarıyla Oluşturuldu!'}</h2>
                  <p style="color: #666; line-height: 1.6;">
                    ${isEnglish ? 
                      'Thank you for joining our community! Your account has been created and you can now access our services.' : 
                      'Topluluğumuza katıldığınız için teşekkür ederiz! Hesabınız oluşturuldu ve artık hizmetlerimize erişebilirsiniz.'
                    }
                  </p>
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #28a745; margin-top: 0;">${isEnglish ? 'What\'s Next?' : 'Sırada Ne Var?'}</h3>
                    <ul style="color: #333; line-height: 1.8;">
                      <li>${isEnglish ? 'Complete your profile in the client panel' : 'Danışan panelinizde profilinizi tamamlayın'}</li>
                      <li>${isEnglish ? 'Explore our nutrition packages' : 'Beslenme paketlerimizi keşfedin'}</li>
                      <li>${isEnglish ? 'Schedule your first consultation' : 'İlk danışmanlık randevunuzu alın'}</li>
                    </ul>
                  </div>
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${window.location.origin}${getLocalizedPath('/danisan-paneli')}" 
                       style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                      ${isEnglish ? 'Access Client Panel' : 'Danışan Paneline Git'}
                    </a>
                  </div>
                  <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
                  <p style="color: #666; font-size: 14px; text-align: center;">
                    ${isEnglish ? 
                      'Need help? Contact us at support@oguzyolyapan.com' : 
                      'Yardıma mı ihtiyacınız var? support@oguzyolyapan.com adresinden bizimle iletişime geçin'
                    }
                  </p>
                </div>
              </div>
            `,
            text: `${isEnglish ? 'Welcome to Oğuz Yolyapan!' : 'Oğuz Yolyapan\'a Hoş Geldiniz!'} ${formData.firstName} ${formData.lastName}`
          });
        } catch (emailError) {
          console.error('Welcome email sending failed:', emailError);
          // Don't block the signup process if email fails
        }

        // Show success message and redirect to login
        const redirectUrl = getLocalizedPath(isEnglish ? '/login?registered=true' : '/giris?registered=true');
        navigate(redirectUrl);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: t('auth.signup.errors.networkError') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('auth.signup.title')} - Oğuz Yolyapan</title>
        <meta name="description" content={t('auth.signup.subtitle')} />
      </Helmet>

      <div className="min-vh-100 d-flex align-items-center py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="mb-3">
                      <i className="bi bi-person-plus text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h1 className="h3 mb-2">{t('auth.signup.title')}</h1>
                    <p className="text-muted">{t('auth.signup.subtitle')}</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Name Row */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="firstName" className="form-label fw-semibold">
                          {t('auth.signup.firstName')} <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder={t('auth.signup.firstName')}
                          autoComplete="given-name"
                          required
                        />
                        {errors.firstName && (
                          <div className="invalid-feedback">{errors.firstName}</div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label fw-semibold">
                          {t('auth.signup.lastName')} <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder={t('auth.signup.lastName')}
                          autoComplete="family-name"
                          required
                        />
                        {errors.lastName && (
                          <div className="invalid-feedback">{errors.lastName}</div>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        {t('auth.signup.email')} <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ornek@email.com"
                          autoComplete="email"
                          required
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label fw-semibold">
                        {t('auth.signup.phone')} <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-telephone"></i>
                        </span>
                        <input
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+90 555 123 45 67"
                          autoComplete="tel"
                          required
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">{errors.phone}</div>
                        )}
                      </div>
                    </div>

                    {/* Password Row */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="password" className="form-label fw-semibold">
                          {t('auth.signup.password')} <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-lock"></i>
                          </span>
                          <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                          />
                          {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="confirmPassword" className="form-label fw-semibold">
                          {t('auth.signup.confirmPassword')} <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-lock-fill"></i>
                          </span>
                          <input
                            type="password"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                          />
                          {errors.confirmPassword && (
                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Info Row */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="birthDate" className="form-label fw-semibold">
                          {t('auth.signup.birthDate')} <span className="text-muted small">({t('common.optional')})</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="gender" className="form-label fw-semibold">
                          {t('auth.signup.gender')} <span className="text-muted small">({t('common.optional')})</span>
                        </label>
                        <select
                          className="form-select"
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">{t('auth.signup.gender')}</option>
                          <option value="male">{t('auth.signup.male')}</option>
                          <option value="female">{t('auth.signup.female')}</option>
                        </select>
                      </div>
                    </div>

                    {/* Terms & Privacy */}
                    <div className="mb-3">
                      <div className="form-check mb-2">
                        <input
                          className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                          type="checkbox"
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="terms">
                          {t('auth.signup.terms')} <span className="text-danger">*</span>
                        </label>
                        {errors.terms && (
                          <div className="invalid-feedback d-block">{errors.terms}</div>
                        )}
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="privacy"
                          name="privacy"
                          checked={formData.privacy}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="privacy">
                          {t('auth.signup.privacy')}
                        </label>
                      </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                      <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {errors.submit}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 mb-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {t('common.loading')}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-check me-2"></i>
                          {t('auth.signup.signupButton')}
                        </>
                      )}
                    </button>
                  </form>

                  {/* Login Link */}
                  <div className="text-center pt-3 border-top">
                    <p className="mb-0 text-muted">
                      {t('auth.signup.hasAccount')}{' '}
                      <Link to={getLocalizedPath(isEnglish ? '/login' : '/giris')} className="text-decoration-none fw-semibold">
                        {t('auth.signup.loginLink')}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
