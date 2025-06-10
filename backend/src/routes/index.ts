// src/routes/index.ts ** mainRoutes/index.ts **
import { Router } from 'express';

// This is the actual routes file
import spirtisBeerProductsRoute from '../spiritsBeerProduct/routes/spiritsBeerProductRoute'
import sessionRoutes from '../sessions/routes/sessionRoutes';
import authRoutes from '../auth/routes/authRoutes';
import userRoutes from '../user/routes/userRoutes';
import stripeRoutes from '../stripe/routes/stripeRoutes';
import companyRoutes from '../company/routes/companyRoutes';
import bizUserRoutes from '../bizUser/routes/bizUserRoutes';

// This si routes from constants 
import { S_B_PRODUCT_ROUTE } from '../spiritsBeerProduct/spiritsBeerproductConstants';
import { SESSION_ROUTE } from '../sessions/sessionConstants';
import { AUTH_ROUTE } from '../auth/authConstants';
import { USER_ROUTE } from '../user/userConstants';
import { STRIPE_ROUTE } from '../stripe/stripeConstants';
import { COMPANY_ROUTE } from '../company/companyConstants';
import { BIZ_USER_ROUTE } from '../bizUser/bizUserConstants';
const router = Router();

// Routes will be mounted here like:
router.use(S_B_PRODUCT_ROUTE, spirtisBeerProductsRoute);
router.use(SESSION_ROUTE, sessionRoutes);
router.use(AUTH_ROUTE, authRoutes);
router.use(USER_ROUTE, userRoutes);
router.use(STRIPE_ROUTE, stripeRoutes);
router.use(COMPANY_ROUTE, companyRoutes);
router.use(BIZ_USER_ROUTE, bizUserRoutes);

export default router;
