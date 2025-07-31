const validateEnv = () => {
  const required = [
    'MONGO_URI',
    'JWT_SECRET',
    'CLIENT_ORIGIN'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    process.exit(1);
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }

  // Validate MongoDB URI
  if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('mongodb')) {
    console.error('❌ Invalid MONGO_URI format');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnv; 