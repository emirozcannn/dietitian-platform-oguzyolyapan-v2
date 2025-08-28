import React, { useState } from 'react';
import * as AuthContext from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const AuthTestPage = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, userRole, userProfile } = AuthContext.useAuth();

  const runAuthTests = async () => {
    setLoading(true);
    setTestResults([]);
    const results = [];

    // Test 1: Profiles table check
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      results.push({
        test: 'Profiles Table Check',
        status: error ? 'FAILED' : 'SUCCESS',
        message: error ? error.message : `Found ${data?.length || 0} profiles`,
        details: { data, error }
      });
    } catch (err) {
      results.push({
        test: 'Profiles Table Check',
        status: 'FAILED',
        message: err.message,
        details: err
      });
    }

    // Test 2: Current user check
    try {
      const { data: session, error } = await supabase.auth.getSession();
      
      results.push({
        test: 'Current Session Check',
        status: error ? 'FAILED' : 'SUCCESS',
        message: error ? error.message : session.session ? `Logged in as: ${session.session.user.email}` : 'Not logged in',
        details: { session, error }
      });
    } catch (err) {
      results.push({
        test: 'Current Session Check',
        status: 'FAILED',
        message: err.message,
        details: err
      });
    }

    // Test 3: Create test users (if admin)
    if (userRole === 'admin') {
      try {
        // Try to create test admin user
        const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
          email: 'admin@oguz.com',
          password: 'password123',
          user_metadata: {
            first_name: 'Oğuz',
            last_name: 'Yolyapan',
            role: 'admin'
          }
        });

        results.push({
          test: 'Create Admin User',
          status: adminError ? 'FAILED' : 'SUCCESS',
          message: adminError ? adminError.message : 'Admin user created',
          details: { adminData, adminError }
        });
      } catch (err) {
        results.push({
          test: 'Create Admin User',
          status: 'FAILED',
          message: err.message,
          details: err
        });
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  const createManualProfile = async () => {
    if (!user) {
      alert('Önce giriş yapmalısınız!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: 'Oğuz',
          last_name: 'Yolyapan',
          role: 'admin'
        });

      if (error) {
        console.error('Profil oluşturma hatası:', error);
        alert(`Hata: ${error.message}`);
      } else {
        console.log('Profil başarıyla oluşturuldu:', data);
        alert('Profil başarıyla oluşturuldu! Sayfayı yenileyin.');
      }
    } catch (err) {
      console.error('Profil oluşturma exception:', err);
      alert(`Exception: ${err.message}`);
    }
  };

  const createTestUser = async () => {
    try {
      console.log('Creating test user...');
      
      // 1. Önce auth user'ı oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'test@test.com',
        password: 'password123'
      });

      if (authError) {
        console.error('Auth user creation error:', authError);
        alert(`Auth Hatası: ${authError.message}`);
        return;
      }

      console.log('Auth user created:', authData);

      // 2. Sonra manuel olarak profil oluştur
      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            first_name: 'Test',
            last_name: 'User',
            role: 'user'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          alert(`Profil Hatası: ${profileError.message}`);
        } else {
          console.log('Profile created:', profileData);
          alert('Test kullanıcısı ve profili başarıyla oluşturuldu!');
        }
      }
    } catch (err) {
      console.error('Test kullanıcısı oluşturma exception:', err);
      alert(`Exception: ${err.message}`);
    }
  };

  const createAdminUser = async () => {
    try {
      console.log('Creating admin user...');
      
      // 1. Önce auth user'ı oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@oguz.com',
        password: 'password123'
      });

      if (authError) {
        console.error('Admin auth user creation error:', authError);
        alert(`Auth Hatası: ${authError.message}`);
        return;
      }

      console.log('Admin auth user created:', authData);

      // 2. Sonra manuel olarak profil oluştur
      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            first_name: 'Oğuz',
            last_name: 'Yolyapan',
            role: 'admin'
          });

        if (profileError) {
          console.error('Admin profile creation error:', profileError);
          alert(`Profil Hatası: ${profileError.message}`);
        } else {
          console.log('Admin profile created:', profileData);
          alert('Admin kullanıcısı ve profili başarıyla oluşturuldu!');
        }
      }
    } catch (err) {
      console.error('Admin kullanıcısı oluşturma exception:', err);
      alert(`Exception: ${err.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2>Authentication Test Page</h2>
          
          {/* Current Auth Status */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Current Authentication Status</h5>
            </div>
            <div className="card-body">
              <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
              <p><strong>Role:</strong> {userRole || 'None'}</p>
              <p><strong>Profile:</strong> {userProfile ? JSON.stringify(userProfile) : 'None'}</p>
            </div>
          </div>

          {/* Test Demo Users */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Test Users</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <h6>Demo Kullanıcıları:</h6>
                <p><strong>Admin:</strong> admin@oguz.com / password123</p>
                <p><strong>User:</strong> test@test.com / password123</p>
                <p className="mb-0"><small>Bu kullanıcıları Supabase Dashboard'da manuel oluşturmanız gerekiyor.</small></p>
              </div>

              <button 
                onClick={runAuthTests}
                disabled={loading}
                className="btn btn-primary me-2"
              >
                {loading ? 'Testing...' : 'Run Auth Tests'}
              </button>

              <button 
                onClick={createManualProfile}
                disabled={!user}
                className="btn btn-success me-2"
              >
                Create Manual Profile
              </button>

              <button 
                onClick={createTestUser}
                className="btn btn-info me-2"
              >
                Create Test User
              </button>

              <button 
                onClick={createAdminUser}
                className="btn btn-warning"
              >
                Create Admin User
              </button>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h5>Test Results</h5>
              </div>
              <div className="card-body">
                {testResults.map((result, index) => (
                  <div key={index} className={`alert ${result.status === 'SUCCESS' ? 'alert-success' : 'alert-danger'}`}>
                    <h6>{result.test}</h6>
                    <p>{result.message}</p>
                    <details>
                      <summary>Details</summary>
                      <pre>{JSON.stringify(result.details, null, 2)}</pre>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;
