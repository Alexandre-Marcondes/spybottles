import { Router } from 'express';

import superAdminCompanyRoutes from './superAdminRoutes';
import superAdminUserRoutes from './superAdminUserRoutes';
import superAdminRoutes from './superAdminRoutes';
// Add more SuperAdmin modules here as needed

const router = Router();
router.use('/superAdmin', superAdminRoutes);
router.use('/company', superAdminCompanyRoutes); // /v1.0.0/super-admin/company/...
router.use('/users', superAdminUserRoutes);      // /v1.0.0/super-admin/users/...

export default router;
