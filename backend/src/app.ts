import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from 'mongoose';

import { swaggerUi, swaggerSpec } from './utils/swagger';
import mainRoutes from '../src/routes';
import { config } from './config';

import adminRoutes from './admin/routes/adminRoutes';
import adminUserRoutes from './admin/routes/adminUserRoutes'



const app = express();
const PORT = config.port;

// Middleware
app.use(express.json());

// connect to MongoDb Atlas

mongoose.connect(config.mongoUri)
.then(() => {
  console.log('Connected to MOngoDB Atlas')
}).catch ((err) => {
  console.error('Mongo connection error', err);
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Default route. 
app.get("/", (req, res) => {
  res.send("Hello, This is the first step to barvoice.com");
});

 // ✅ Main Routes (for API)
app.use('/', mainRoutes);

// ✅ Step 3: Admin-only tools
app.use('/v1.0.0/admin', adminRoutes);
app.use('/v1.0.0/admin/users', adminUserRoutes);


app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
