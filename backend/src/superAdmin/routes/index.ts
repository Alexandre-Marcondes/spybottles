// src/superAdmin/routes/index.ts
import { Router } from 'express';

import superAdminCompanyRoutes from './superAdminCompanyRoutes';
import superAdminUserRoutes from './superAdminUserRoutes';
import superAdminProductsRoutes from './superAdminProductsRoutes';

import { SUPER_ADMIN_PRODUCT_ROUTE } from '../superAdminProductConstants';
import { SUPER_ADMIN_USER_ROUTE } from '../superAdminUserConstants';
import { SUPER_ADMIN_COMPANY_ROUTE } from '../superAdminCompanyConstants';

const router = Router();

// Now we define sub-paths
router.use(SUPER_ADMIN_PRODUCT_ROUTE , superAdminProductsRoutes);
router.use(SUPER_ADMIN_USER_ROUTE, superAdminUserRoutes);  
router.use(SUPER_ADMIN_COMPANY_ROUTE, superAdminCompanyRoutes);

export default router;
