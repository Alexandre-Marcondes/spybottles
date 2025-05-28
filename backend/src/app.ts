import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { swaggerUi, swaggerSpec } from './utils/swagger';
import mainRoutes from '../src/routes';
import { config } from './config';

import superAdminRoutes from './superAdmin/routes/superAdminRoutes';
import superAdminUserRoutes from './superAdmin/routes/superAdminUserRoutes'



const app = express();
const PORT = config.port;

// 🔒 Capture raw body for Stripe webhook validation ** must come before express.json()
app.use(
  '/v1.0.0/stripe/webhook',
  bodyParser.raw({ type: 'application/json' })
);

// Middleware
app.use(express.json());

// connect to MongoDb Atlas
mongoose.connect(config.mongoUri)
.then(() => {
  console.log('Connected to MOngoDB Atlas')
}).catch ((err) => {
  console.error('Mongo connection error:', err);
})

// Enables Swagger UI at /docs route for interactive API documentation.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Default route. 
app.get("/", (req, res) => {
  res.send("Hello, This is the first step to SPYBOTTLES.com");
});

 // ✅ Main Routes (for API)
app.use('/', mainRoutes);

// ✅ Step 3: Admin-only tools
// ✅ Step 3: SuperAdmin-only tools
app.use('/v1.0.0/super-admin', superAdminRoutes);
app.use('/v1.0.0/super-admin/users', superAdminUserRoutes);



app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
