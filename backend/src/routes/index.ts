// src/routes/index.ts
import { Router } from 'express';

// This is the actual routes file

import productRoutes from '../product/routes/productRoutes';
import sessionRoutes from '../sessions/routes/sessionRoutes';
import authRoutes from '../auth/routes/authRoutes';
import userRoutes from '../user/routes/userRoutes';

// This si routes from constants 
import { PRODUCT_ROUTE } from '../../src/product/productConstants';
import { SESSION_ROUTE } from '../sessions/sessionConstants';
import { AUTH_ROUTE } from '../auth/authConstants';
import { USER_ROUTE } from '../user/userConstants';
const router = Router();

// Routes will be mounted here like:
router.use(PRODUCT_ROUTE, productRoutes);
router.use(SESSION_ROUTE, sessionRoutes);
router.use(AUTH_ROUTE, authRoutes);
router.use(USER_ROUTE, userRoutes);

export default router;
