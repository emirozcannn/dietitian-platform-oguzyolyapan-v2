// Test script for API endpoints
const API_BASE_URL = 'https://oguz-dietitian-backend.vercel.app/api';

async function testAPI() {
  console.log('🧪 API Test Script Başlıyor...\n');

  const tests = [
    {
      name: 'Health Check',
      url: `${API_BASE_URL}/health`,
      method: 'GET'
    },
    {
      name: 'Blog Posts (All)',
      url: `${API_BASE_URL}/blog?limit=5`,
      method: 'GET'
    },
    {
      name: 'Featured Posts',
      url: `${API_BASE_URL}/blog?type=featured&limit=3`,
      method: 'GET'
    },
    {
      name: 'Categories',
      url: `${API_BASE_URL}/categories`,
      method: 'GET'
    },
    {
      name: 'Login Test',
      url: `${API_BASE_URL}/auth?type=login`,
      method: 'POST',
      body: {
        email: 'admin@oguzyolyapan.com',
        password: 'admin123'
      }
    },
    {
      name: 'Create Blog Post',
      url: `${API_BASE_URL}/blog`,
      method: 'POST',
      body: {
        title_tr: 'Test Blog Yazısı',
        title_en: 'Test Blog Post',
        content_tr: 'Bu bir test yazısıdır.',
        content_en: 'This is a test post.',
        status: 'draft'
      }
    }
  ];

  for (const test of tests) {
    try {
      console.log(`⏳ Testing: ${test.name}`);
      
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(test.url, options);
      const result = await response.json();

      if (response.ok) {
        console.log(`✅ ${test.name}: SUCCESS`);
        if (result.data) {
          console.log(`   Data length: ${Array.isArray(result.data) ? result.data.length : 'Object'}`);
        }
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${result.message || result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`💥 ${test.name}: EXCEPTION`);
      console.log(`   Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }

  console.log('🏁 API Test Script Tamamlandı!');
}

// Node.js ortamında çalıştırmak için
if (typeof window === 'undefined') {
  // Node.js - fetch polyfill gerekli
  import('node-fetch').then(fetch => {
    global.fetch = fetch.default;
    testAPI();
  }).catch(() => {
    console.log('❌ node-fetch modülü bulunamadı. npm install node-fetch yapın.');
  });
} else {
  // Browser
  testAPI();
}
