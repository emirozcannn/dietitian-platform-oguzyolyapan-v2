// Simple test endpoint
module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = {
      success: true,
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      mongodb: process.env.MONGODB_URI ? 'configured' : 'not configured'
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Test endpoint error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
