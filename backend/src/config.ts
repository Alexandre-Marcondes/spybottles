if(!process.env.MONGO_URI) {
    throw new Error ('MONGO_URI is not defined in .env');
}

export const config = {
    mongoUri: process.env.MONGO_URI || '',
    port: process.env.PORT || 3000,
  
    adminJwtSecret: process.env.ADMIN_JWT_SECRET || 'fallbackAdminSecret',
    // Add future keys below:
    // aws: {
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    //   bucketName: process.env.AWS_BUCKET_NAME || '',
    // },
  };
  